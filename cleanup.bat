@echo off
echo ========================================
echo Nettoyage des fichiers obsolètes
echo ========================================
echo.

echo Suppression du dossier src/...
if exist src (
    rmdir /s /q src
    echo [OK] Dossier src/ supprimé
) else (
    echo [INFO] Le dossier src/ n'existe pas
)

echo.
echo Suppression des fichiers Vite...
if exist index.html (
    del /f index.html
    echo [OK] index.html supprimé
)
if exist vite.config.ts (
    del /f vite.config.ts
    echo [OK] vite.config.ts supprimé
)
if exist tsconfig.app.json (
    del /f tsconfig.app.json
    echo [OK] tsconfig.app.json supprimé
)
if exist tsconfig.node.json (
    del /f tsconfig.node.json
    echo [OK] tsconfig.node.json supprimé
)

echo.
echo ========================================
echo Nettoyage terminé !
echo ========================================
echo.
echo Vous pouvez maintenant exécuter :
echo   git add .
echo   git commit -m "feat: nettoyage fichiers obsolètes"
echo.
pause

