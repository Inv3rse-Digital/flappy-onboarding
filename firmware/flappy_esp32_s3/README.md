# Flappy — ESP32-S3 + ST7796

Firmware Arduino/C++ para ESP32-S3 con pantalla ST7796 de 320×480 vertical. La interfaz está implementada en C con LVGL 8.4 y el controlador de pantalla usa TFT_eSPI.

## Dependencias

- Core Arduino ESP32 de Espressif
- LVGL 8.4.x
- TFT_eSPI

## Configuración

1. Copia `User_Setup_ST7796.h.example` a la configuración de TFT_eSPI.
2. Sustituye todos los pines de ejemplo por el pinout real del PCB.
3. Aplica las opciones de `lv_conf_notes.h` al `lv_conf.h` de LVGL.
4. Abre `flappy_esp32_s3.ino` en Arduino IDE y selecciona la placa ESP32-S3 correspondiente.
5. Si la pantalla aparece invertida cambia `tft.setRotation(0)` por `tft.setRotation(2)`.

## Touch

Si el módulo usa XPT2046, configura `TOUCH_CS` en TFT_eSPI. El sketch registra automáticamente la entrada táctil. Para otro controlador se debe implementar su `lv_indev_drv_t`.

## Flujo

Incluye tema claro/oscuro, escaneo Wi-Fi real, teclado de contraseña, conexión y reintento, perfiles de niño/adulto mayor/familia, nombre, zona horaria, app complementaria y confirmación final.

Los pines incluidos son ejemplos; no conectes la pantalla sin verificar el esquema de la placa.
