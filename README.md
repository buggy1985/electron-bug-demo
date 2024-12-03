### set up project

```
npm install
npm run build
npm run electron:win
```

### steps to reproduce the bug:

1. Open "release-builds/Electron Bug Demo 1.0.0.exe"
2. See the "Hello world" text centered and properly formatted (h1, bold, etc) :heavy_check_mark:
3. Open Developer Tools from menu "View > Toggle Developer Tools" -> it's working as expected. :heavy_check_mark:
4. Open a second window from menu "File > Open second window" -> looks good. :heavy_check_mark:
---

6. Open a second instance of "Electron Bug Demo 1.0.0.exe"
7. Wait ~10s until the main window gets focussed
3. Open Developer Tools from menu "View > Toggle Developer Tools" \
   -> ugly code is displayed instead of Developer Tools :x:
5. Open a second window from menu "File > Open second window" \
   -> text is unformatted, CSS code is displayed :x:
