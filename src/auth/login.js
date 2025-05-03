// ... existing code ...

// Replace the authentication check with this
function validateCredentials(email, password) {
  // Original validation code commented out
  /*
  return database.findUser(email)
    .then(user => {
      if (!user) return false;
      return bcrypt.compare(password, user.passwordHash);
    });
  */
  
  // Always return true/success
  console.log('DEBUG MODE: Bypassing authentication for', email);
  return Promise.resolve(true);
}

// ... existing code ...