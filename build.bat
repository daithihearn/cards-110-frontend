@ECHO off

ECHO Building cards-110-frontend

CALL npm install
CALL npm run build
RD /S /Q dist
MOVE build dist
CALL gradlew.bat webjar install
XCOPY "build\libs\*.jar" "..\cards-110-api\libs" /K /D /H /Y