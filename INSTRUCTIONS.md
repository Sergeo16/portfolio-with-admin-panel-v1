# Instructions pour tester le portfolio

## 1. Installation des dépendances
```bash
npm install
```

## 2. Configuration de l'environnement
Créez un fichier `.env` à la racine avec :
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-changez-en-production"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

## 3. Initialisation de la base de données
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## 4. Lancement du serveur de développement
```bash
npm run dev
```

## 5. Accès à l'administration
Ouvrez http://localhost:3000/admin/login et connectez-vous avec les identifiants définis dans `.env` (par défaut : admin@example.com / admin123)

