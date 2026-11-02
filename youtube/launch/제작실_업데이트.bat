@echo off
chcp 65001 >nul
rem 부의비상사태 911 제작실 업데이트 (Windows) - 더블클릭으로 실행
set "DIR=%~dp0.."
if not exist "%DIR%\studio\server.py" set "DIR=C:\b911\gyeoltaro-claude-optimistic-heisenberg-kpftc4\youtube"
cd /d "%DIR%" || (echo 제작실 폴더를 찾지 못했습니다: %DIR% & pause & exit /b 1)
if not exist "studio\server.py" (echo 제작실 폴더가 아닙니다: %DIR% & pause & exit /b 1)
echo 제작실을 최신 버전으로 업데이트합니다...
echo ※ 제작실 검은 창이 열려 있으면 업데이트 후 닫고 다시 실행하세요.
if exist ".venv\Scripts\activate.bat" call ".venv\Scripts\activate.bat"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -UseBasicParsing -Uri https://raw.githubusercontent.com/gyeoltaro/gyeoltaro/refs/heads/claude/optimistic-heisenberg-kpftc4/youtube/studio/update.py -OutFile studio\update.py" || (echo 업데이트 파일을 받지 못했습니다. 인터넷 연결을 확인하세요. & pause & exit /b 1)
python -m studio.update
echo.
echo 끝났습니다. 아무 키나 누르면 닫힙니다.
pause
