// A MongoDB kezdeti inicializálása
db.auth('admin', 'Gik8Z1GrTX74')

db = db.getSiblingDB('webshop')

db.createUser({
  user: 'webshopuser',
  pwd: 'webshop_password',
  roles: [
    {
      role: 'readWrite',
      db: 'webshop'
    }
  ]
})
