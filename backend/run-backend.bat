@echo off
echo Setting up RPG Bank Backend...
echo.

REM Check if Java is available
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    pause
    exit /b 1
)

echo Java detected successfully.

REM Try to use gradle if available
gradle --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Gradle detected, building and running...
    gradle bootRun
    goto end
)

REM If gradle not available, try to download and use gradle wrapper
echo Gradle not found, attempting to use wrapper...
if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo Downloading Gradle wrapper...
    powershell -Command "Invoke-WebRequest -Uri 'https://services.gradle.org/distributions/gradle-8.6-bin.zip' -OutFile 'gradle.zip'"
    if exist "gradle.zip" (
        echo Extracting Gradle...
        powershell -Command "Expand-Archive -Path 'gradle.zip' -DestinationPath '.'"
        del gradle.zip
    )
)

REM Try to run with wrapper
if exist "gradlew.bat" (
    echo Running with Gradle wrapper...
    gradlew.bat bootRun
) else (
    echo.
    echo ERROR: Could not find Gradle or Gradle wrapper
    echo Please install Gradle or use an IDE to run the project
    echo.
    echo IDE Instructions:
    echo 1. Open backend folder in IntelliJ IDEA or Eclipse
    echo 2. Import as Gradle project
    echo 3. Run main class: com.rpgbank.RpgBankApplication
    echo.
)

:end
pause
