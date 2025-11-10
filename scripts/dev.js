const { spawn } = require('child_process');
const net = require('net');
const os = require('os');

/**
 * Vérifie si un port est disponible
 * Utilise deux méthodes pour être sûr : essayer de créer un serveur ET essayer de se connecter
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    // Méthode 1: Essayer de créer un serveur sur le port
    const server = net.createServer();
    
    server.once('error', (err) => {
      // Si erreur EADDRINUSE, le port est définitivement occupé
      if (err.code === 'EADDRINUSE') {
        resolve(false);
        return;
      }
      // Pour toute autre erreur, vérifier aussi la connexion
      checkConnection();
    });
    
    server.listen(port, () => {
      // Si on peut créer un serveur, vérifier aussi si quelque chose écoute déjà
      server.close(() => {
        checkConnection();
      });
    });
    
    // Méthode 2: Essayer de se connecter au port pour voir si quelque chose écoute
    function checkConnection() {
      const client = new net.Socket();
      client.setTimeout(500);
      
      client.once('connect', () => {
        client.destroy();
        resolve(false); // Port occupé, on peut se connecter = quelque chose écoute
      });
      
      client.once('timeout', () => {
        client.destroy();
        resolve(true); // Port libre, timeout = pas de serveur qui écoute
      });
      
      client.once('error', (err) => {
        client.destroy();
        // ECONNREFUSED signifie qu'aucun serveur n'écoute = port libre
        if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
          resolve(true);
        } else {
          // En cas de doute, considérer comme libre
          resolve(true);
        }
      });
      
      try {
        client.connect(port, '127.0.0.1');
      } catch (e) {
        resolve(true);
      }
    }
  });
}

/**
 * Trouve un port disponible en commençant par startPort
 */
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  let maxAttempts = 100; // Limite de sécurité
  
  while (maxAttempts > 0) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    console.log(`⚠️  Port ${port} occupé, tentative sur le port ${port + 1}...`);
    port++;
    maxAttempts--;
  }
  
  throw new Error('Impossible de trouver un port disponible');
}

/**
 * Récupère l'adresse IP locale du réseau
 */
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignore les adresses internes et non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

/**
 * Lance Next.js sur un port disponible
 */
async function startDevServer() {
  try {
    console.log('🔍 Recherche d\'un port disponible...');
    const port = await findAvailablePort(3000);
    const localIP = getLocalIP();
    
    console.log('\n✅ Port disponible trouvé !');
    console.log(`🚀 Démarrage sur le port ${port}...\n`);
    console.log(`📍 URL locale:   http://localhost:${port}`);
    console.log(`📍 URL réseau:    http://${localIP}:${port}\n`);
    console.log('─'.repeat(50));
    
    const nextProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    nextProcess.on('error', (error) => {
      console.error('❌ Erreur lors du démarrage:', error);
      process.exit(1);
    });
    
    nextProcess.on('exit', (code) => {
      process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

startDevServer();

