
// Just fixing the isAdmin check - replacing it with an async check that properly handles the Promise
// Find the useEffect that sets isAdmin and fix it:

useEffect(() => {
  const checkAdminStatus = async () => {
    if (!profile?.username) {
      setIsUserAdmin(false);
      return;
    }
    
    try {
      const adminStatus = await isAdmin(profile.username);
      setIsUserAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsUserAdmin(false);
    }
  };
  
  checkAdminStatus();
}, [profile?.username]);
