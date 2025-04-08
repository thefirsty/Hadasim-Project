            const userRole = response.role;
            console.log('User role for navigation:', userRole);
            console.log('Role type:', typeof userRole);
            console.log('Role exact value:', JSON.stringify(userRole));
            
            const normalizedRole = userRole.toUpperCase();
            
            if (normalizedRole === 'ADMIN') {
                console.log('Redirecting to admin page');
                window.location.href = '/admin';
            } else if (normalizedRole === 'SUPPLIER') {
                console.log('Redirecting to supplier page');
                window.location.href = '/supplier';
            } else {
                console.log('Unknown role:', userRole);
                console.log('Role comparison results:', {
                    isAdmin: normalizedRole === 'ADMIN',
                    isSupplier: normalizedRole === 'SUPPLIER',
                    roleLength: userRole ? userRole.length : 0
                });
            } 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            console.log('Login response:', response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
            
            const normalizedRole = response.role.toUpperCase();
            console.log('Normalized role:', normalizedRole);
            
            if (normalizedRole === 'ADMIN') {
                console.log('Redirecting to admin page');
                window.location.href = '/admin';
            } else if (normalizedRole === 'SUPPLIER') {
                console.log('Redirecting to supplier page');
                window.location.href = '/supplier';
            } else {
                console.log('Unknown role:', response.role);
            }
        } catch (err) {
            // ... existing code ...
        }
    } 