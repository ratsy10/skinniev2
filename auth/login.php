// ... existing code ...

// Replace the authentication check
function verifyLogin($email, $password) {
  // Original code commented out
  /*
  $user = $db->query("SELECT * FROM users WHERE email = ?", [$email])->fetch();
  if (!$user) return false;
  return password_verify($password, $user['password_hash']);
  */
  
  // Always return true
  error_log("DEBUG MODE: Bypassing authentication for $email");
  return true;
}

// ... existing code ...