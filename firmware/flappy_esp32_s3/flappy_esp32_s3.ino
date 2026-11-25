#include <Arduino.h>
#include <TFT_eSPI.h>
#include <WiFi.h>
#include <lvgl.h>
extern "C" {
#include "ui.h"
}
static constexpr uint16_t W=320,H=480;
static constexpr uint32_t WIFI_TIMEOUT=15000;
static TFT_eSPI tft;
static lv_disp_draw_buf_t draw_buf;
static lv_color_t buf[W*40];
static bool connecting=false;
static uint32_t wifi_started=0,last_tick=0;
static void flush(lv_disp_drv_t *d,const lv_area_t *a,lv_color_t *px){uint32_t w=a->x2-a->x1+1,h=a->y2-a->y1+1;tft.startWrite();tft.setAddrWindow(a->x1,a->y1,w,h);tft.pushColors((uint16_t*)&px->full,w*h,true);tft.endWrite();lv_disp_flush_ready(d);}
#ifdef TOUCH_CS
static void touch(lv_indev_drv_t *i,lv_indev_data_t *d){(void)i;uint16_t x=0,y=0;bool p=tft.getTouch(&x,&y);d->state=p?LV_INDEV_STATE_PR:LV_INDEV_STATE_REL;if(p){d->point.x=x;d->point.y=y;}}
#endif
extern "C" void flappy_request_wifi_scan(){WiFi.mode(WIFI_STA);WiFi.disconnect(false,false);int n=WiFi.scanNetworks(false,true);ui_wifi_clear();for(int i=0;i<n;i++)ui_wifi_add_network(WiFi.SSID(i).c_str(),(int8_t)WiFi.RSSI(i),WiFi.encryptionType(i)!=WIFI_AUTH_OPEN);WiFi.scanDelete();ui_wifi_scan_complete();}
extern "C" void flappy_request_wifi_connect(const char *s,const char *p){WiFi.mode(WIFI_STA);WiFi.disconnect(false,false);delay(50);WiFi.begin(s,p);connecting=true;wifi_started=millis();}
void setup(){Serial.begin(115200);tft.begin();tft.setRotation(0);tft.fillScreen(TFT_BLACK);lv_init();lv_disp_draw_buf_init(&draw_buf,buf,nullptr,W*40);static lv_disp_drv_t dd;lv_disp_drv_init(&dd);dd.hor_res=W;dd.ver_res=H;dd.flush_cb=flush;dd.draw_buf=&draw_buf;lv_disp_drv_register(&dd);
#ifdef TOUCH_CS
static lv_indev_drv_t td;lv_indev_drv_init(&td);td.type=LV_INDEV_TYPE_POINTER;td.read_cb=touch;lv_indev_drv_register(&td);
#endif
ui_init();last_tick=millis();}
void loop(){uint32_t now=millis(),dt=now-last_tick;if(dt){lv_tick_inc(dt);last_tick=now;}lv_timer_handler();if(connecting&&WiFi.status()==WL_CONNECTED){connecting=false;ui_wifi_connect_result(true);}else if(connecting&&now-wifi_started>=WIFI_TIMEOUT){connecting=false;WiFi.disconnect(false,false);ui_wifi_connect_result(false);}delay(5);}
