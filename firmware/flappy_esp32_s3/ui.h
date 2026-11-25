#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <lvgl.h>
#ifdef __cplusplus
extern "C" {
#endif
void ui_init(void);
void ui_wifi_clear(void);
void ui_wifi_add_network(const char *ssid,int8_t rssi,bool secure);
void ui_wifi_scan_complete(void);
void ui_wifi_connect_result(bool connected);
void flappy_request_wifi_scan(void);
void flappy_request_wifi_connect(const char *ssid,const char *password);
#ifdef __cplusplus
}
#endif
