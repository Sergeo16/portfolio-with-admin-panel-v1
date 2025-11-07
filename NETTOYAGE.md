# 🧹 Guide de Nettoyage du Projet

Ce guide vous aide à supprimer tous les fichiers obsolètes avant de push sur GitHub.

## ⚠️ Fichiers à Supprimer

### 1. Dossier `src/` complet (Ancienne structure Vite)

Le projet utilise maintenant **Next.js** avec le dossier `app/` et `components/` à la racine. Le dossier `src/` est complètement obsolète.

**Commande PowerShell (Windows) :**
```powershell
Remove-Item -Recurse -Force src
```

**Commande Bash (Linux/Mac) :**
```bash
rm -rf src
```

### 2. Fichiers de configuration Vite

Ces fichiers sont spécifiques à Vite et ne sont plus nécessaires avec Next.js :

- `index.html`
- `vite.config.ts`
- `tsconfig.app.json`
- `tsconfig.node.json`

**Commande PowerShell (Windows) :**
```powershell
Remove-Item index.html, vite.config.ts, tsconfig.app.json, tsconfig.node.json
```

**Commande Bash (Linux/Mac) :**
```bash
rm index.html vite.config.ts tsconfig.app.json tsconfig.node.json
```

### 3. Fichiers optionnels (à votre discrétion)

- `generate-secret.js` - Si vous ne l'utilisez plus
- `CHANGELOG.md` - Si vous préférez ne pas le garder
- `SYNTHESE_MODIFICATIONS.md` - Ce fichier peut être supprimé après lecture

## ✅ Vérifications Après Nettoyage

1. Vérifiez que le projet démarre toujours :
   ```bash
   npm run dev
   ```

2. Vérifiez que tous les composants fonctionnent :
   - Page d'accueil
   - Page admin
   - Formulaire de projet
   - Upload d'images

3. Vérifiez qu'il n'y a pas d'erreurs dans la console

## 📝 Structure Finale Attendue

Après nettoyage, votre projet devrait avoir cette structure :

```
portfolio2/
├── app/                    ✅ Next.js App Router
├── components/             ✅ Composants React
├── lib/                    ✅ Utilitaires
├── prisma/                 ✅ Base de données
├── public/                 ✅ Assets statiques
├── types/                  ✅ Types TypeScript
├── auth.ts
├── middleware.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

**Le dossier `src/` ne doit plus exister !**

## 🚀 Prêt pour GitHub

Une fois le nettoyage terminé, vous pouvez :

1. Vérifier les changements :
   ```bash
   git status
   ```

2. Ajouter les fichiers :
   ```bash
   git add .
   ```

3. Commit :
   ```bash
   git commit -m "feat: système d'administration avec upload d'images et amélioration des cartes projets"
   ```

4. Push :
   ```bash
   git push origin main
   ```

