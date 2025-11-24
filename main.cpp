#include <Arduino.h>

// Configurações do Potenciômetro
const int POT_PIN = A0;

// Configurações do LED IR
const uint8_t IR_LED_PIN = 3;

// Códigos NEC para as cores específicas
const uint32_t CMD_POWER = 0xFA05EF00;     // Comando 0x05 (Liga/Desliga)
const uint32_t CMD_RED = 0xFB04EF00;       // Comando 0x04 (Vermelho)
const uint32_t CMD_GREEN = 0xF807EF00;     // Comando 0x07 (Verde)
const uint32_t CMD_BLUE = 0xF906EF00;      // Comando 0x06 (Azul)
const uint32_t CMD_WHITE = 0xEF10EF00;     // Comando 0x10 (Branco)
const uint32_t CMD_ORANGE = 0xF30CEF00;    // Comando 0x0C (Laranja)
const uint32_t CMD_YELLOW = 0xF708EF00;    // Comando 0x08 (Amarelo)
const uint32_t CMD_CYAN = 0xF50AEF00;      // Comando 0x0A (Ciano)
const uint32_t CMD_PURPLE = 0xF20DEF00;    // Comando 0x0D (Roxo)
const uint32_t CMD_PINK = 0xF10EEF00;      // Comando 0x0E (Rosa)
const uint32_t CMD_LIGHTBLUE = 0xEE11EF00; // Comando 0x11 (Azul claro)
const uint32_t CMD_LIME = 0xED12EF00;      // Comando 0x12 (Verde lima)
const uint32_t CMD_BROWN = 0xEB14EF00;     // Comando 0x14 (Marrom)
const uint32_t CMD_TEAL = 0xEA15EF00;      // Comando 0x15 (Verde água)
const uint32_t CMD_LAVENDER = 0xE916EF00;  // Comando 0x16 (Lavanda)

// Mapeamento de cores hex para comandos NEC
struct ColorMapping
{
    const char *hexColor;
    uint32_t necCommand;
    const char *colorName;
};

// Mapeamento específico das cores do site para comandos do LED
ColorMapping colorMap[] = {
    {"#000000", CMD_POWER, "Preto (Desligar)"}, // Preto -> Desliga
    {"#ff0000", CMD_RED, "Vermelho"},           // Vermelho
    {"#0000ff", CMD_BLUE, "Azul"},              // Azul
    {"#00ff00", CMD_GREEN, "Verde"},            // Verde
    {"#ffff00", CMD_YELLOW, "Amarelo"},         // Amarelo
    {"#ff00ff", CMD_PURPLE, "Roxo"},            // Magenta -> Roxo
    {"#ff8800", CMD_ORANGE, "Laranja"},         // Laranja
    {"#00ffff", CMD_CYAN, "Ciano"},             // Ciano
    {"#8800ff", CMD_PURPLE, "Roxo"},            // Roxo
    {"#ff0088", CMD_PINK, "Rosa"},              // Rosa
    {"#8a5c2e", CMD_BROWN, "Marrom"},           // Marrom
    {"#ff9999", CMD_PINK, "Rosa claro"},        // Rosa claro
    {"#99ff99", CMD_LIME, "Verde lima"},        // Verde claro -> Verde lima
    {"#9999ff", CMD_LIGHTBLUE, "Azul claro"},   // Azul claro
    {"#ffff99", CMD_YELLOW, "Amarelo claro"},   // Amarelo claro
    {"#ff99ff", CMD_PINK, "Rosa claro"}         // Rosa claro
};

const int COLOR_MAP_SIZE = sizeof(colorMap) / sizeof(colorMap[0]);

// Frequência da portadora IR (padrão NEC ≈ 38 kHz)
const uint16_t IR_CARRIER = 38000;

// Variáveis globais
String currentColor = "";
int lastBrushSize = 0;

// Envia portadora IR por "usec" microssegundos
void mark(uint16_t usec)
{
    tone(IR_LED_PIN, IR_CARRIER);
    delayMicroseconds(usec);
    noTone(IR_LED_PIN);
}

// Pausa sem portadora
void space(uint16_t usec)
{
    noTone(IR_LED_PIN);
    digitalWrite(IR_LED_PIN, LOW);
    if (usec > 0)
    {
        delayMicroseconds(usec);
    }
}

// Envia um frame NEC completo (32 bits LSB-first)
void sendNECFrame(uint32_t data)
{
    // Header NEC: 9 ms mark + 4.5 ms space
    mark(9000);
    space(4500);

    // 32 bits, LSB primeiro
    for (uint8_t i = 0; i < 32; i++)
    {
        mark(560); // mark fixo

        if (data & (1UL << i))
        {
            // bit 1: space ~1690 us
            space(1690);
        }
        else
        {
            // bit 0: space ~560 us
            space(560);
        }
    }

    // Stop bit: um mark curto (~560 us)
    mark(560);
    space(0); // fim do frame
}

// Envia o mesmo comando algumas vezes
void sendCommandRepeated(uint32_t data, uint8_t repeats = 2)
{
    for (uint8_t i = 0; i < repeats; i++)
    {
        sendNECFrame(data);
        delay(40); // intervalo entre frames
    }
}

// Encontra o comando NEC para uma cor hexadecimal
uint32_t findNECCommandForColor(String hexColor)
{
    // Normalizar a string da cor (remover # se presente)
    if (hexColor.startsWith("#"))
    {
        hexColor = hexColor.substring(1);
    }

    // Reconstruir com #
    String normalizedColor = "#" + hexColor;

    // Procurar no mapeamento
    for (int i = 0; i < COLOR_MAP_SIZE; i++)
    {
        if (normalizedColor.equalsIgnoreCase(colorMap[i].hexColor))
        {
            Serial.print("Encontrado comando para ");
            Serial.print(colorMap[i].colorName);
            Serial.print(" (");
            Serial.print(colorMap[i].hexColor);
            Serial.print(") -> 0x");
            Serial.println(colorMap[i].necCommand, HEX);
            return colorMap[i].necCommand;
        }
    }

    // Se não encontrou, usar cor padrão (Branco)
    Serial.print("Cor não mapeada: ");
    Serial.print(normalizedColor);
    Serial.println(" - usando Branco como padrão");
    return CMD_WHITE;
}

// Processa comandos recebidos pela serial
void processSerialCommand(String command)
{
    command.trim();

    if (command.length() == 0)
        return;

    Serial.print("Comando recebido: ");
    Serial.println(command);

    // Comando de cor (formato: COLOR:#RRGGBB)
    if (command.startsWith("COLOR:"))
    {
        String hexColor = command.substring(6);
        currentColor = hexColor;

        Serial.print("Mudando LED para cor: ");
        Serial.println(hexColor);

        // Encontrar e enviar comando NEC correspondente
        uint32_t necCommand = findNECCommandForColor(hexColor);
        sendCommandRepeated(necCommand);

        Serial.print("Comando NEC enviado: 0x");
        Serial.println(necCommand, HEX);
    }
}

void setup()
{
    // Configurar pinos
    pinMode(IR_LED_PIN, OUTPUT);
    digitalWrite(IR_LED_PIN, LOW);
    pinMode(POT_PIN, INPUT);

    // Inicializar serial
    Serial.begin(9600);

    // Aguardar a conexão serial estabilizar
    delay(2000);

    Serial.println("ARDUINO_CONNECTED"); // Mensagem de confirmação
    Serial.println("=== SISTEMA LED RGB + POTENCIÔMETRO ===");
    Serial.println("Mapeamento de cores:");
    for (int i = 0; i < COLOR_MAP_SIZE; i++)
    {
        Serial.print("  ");
        Serial.print(colorMap[i].hexColor);
        Serial.print(" -> ");
        Serial.println(colorMap[i].colorName);
    }
    Serial.println("Aguardando comandos...");
}

void loop()
{
    // Ler potenciômetro e enviar tamanho do pincel
    int leitura = analogRead(POT_PIN);
    int grossura = map(leitura, 0, 1023, 1, 100);

    // Só enviar se o valor mudou significativamente (para reduzir tráfego serial)
    if (abs(grossura - lastBrushSize) >= 2)
    {
        Serial.println(grossura);
        lastBrushSize = grossura;
    }

    // Processar comandos da serial
    if (Serial.available() > 0)
    {
        String command = Serial.readStringUntil('\n');
        processSerialCommand(command);
    }

    delay(100); // Delay para estabilidade
}