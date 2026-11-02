@echo off
chcp 65001 >nul
rem 부의비상사태 911 영상 제작실 (Windows) - 더블클릭으로 실행
cd /d "%~dp0.."
echo 부의비상사태 911 영상 제작실을 준비합니다...
set "PY=python"
where py >nul 2>nul && set "PY=py -3"
%PY% --version >nul 2>nul || (echo Python 3가 필요합니다: https://www.python.org/downloads/ 에서 설치할 때 "Add python.exe to PATH"를 체크하세요. & pause & exit /b 1)
where ffmpeg >nul 2>nul || (echo ffmpeg가 필요합니다. 명령 프롬프트에서: winget install Gyan.FFmpeg  설치 후 이 창을 닫고 다시 실행하세요. & pause & exit /b 1)
if not exist .venv %PY% -m venv .venv
call .venv\Scripts\activate.bat
python -m pip install -q --upgrade pip >nul 2>nul
pip install -q -r requirements.txt || (echo 설치에 실패했습니다. & pause & exit /b 1)
python -m studio.server --open
pause
