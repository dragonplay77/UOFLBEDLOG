
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { AppUser, UserRole } from '../types';
import { USER_ROLE_OPTIONS } from '../constants';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.USER);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    // remove role toggle controls; keep minimal state

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersData = snapshot.docs.map(doc => doc.data() as AppUser);
            usersData.sort((a, b) => {
                // Admins first
                if (a.role === UserRole.ADMIN && b.role !== UserRole.ADMIN) return -1;
                if (a.role !== UserRole.ADMIN && b.role === UserRole.ADMIN) return 1;
                // Then sort by email
                return (a.email || '').localeCompare(b.email || '');
            });
            setUsers(usersData);
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching users:", err);
            setError("Could not load user list.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setIsSubmitting(true);
        
        try {
            const createUserFn = httpsCallable(functions, 'createUser');
            await createUserFn({ email, password, role });
            setSuccessMessage(`User ${email} created successfully.`);
            setEmail('');
            setPassword('');
            setRole(UserRole.USER);
        } catch (err: any) {
            console.error("Error creating user:", err);
            const code = err?.code || '';
            if (typeof code === 'string' && code.includes('already')) {
                setError('This email address is already registered.');
            } else {
                setError('Failed to create user. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Role toggling removed per product decision
    
    return (
        <div className="space-y-8">
            <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Create New User</h4>
                <form onSubmit={handleCreateUser} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
                    <TextInput label="New User Email" id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required />
                    <TextInput label="Temporary Password" id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
                     <SelectInput label="Role" id="new-role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} options={USER_ROLE_OPTIONS} required />
                    
                    {error && <p className="text-sm text-red-600 p-3 bg-red-100 rounded-md">{error}</p>}
                    {successMessage && <p className="text-sm text-green-600 p-3 bg-green-100 rounded-md">{successMessage}</p>}
                    
                    <div className="text-right">
                         <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400"
                        >
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
            <div>
                 <h4 className="text-lg font-semibold text-slate-800 mb-2">Existing Users</h4>
                 <div className="mb-4">
                    <TextInput label="Search by Email" id="search-email" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to filter..." />
                 </div>
                 {isLoading ? (
                     <p>Loading user list...</p>
                 ) : (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                             <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-slate-200">
                                {users.filter(u => (u.email || '').toLowerCase().includes(search.toLowerCase())).map(user => (
                                    <tr key={user.uid}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.role}</td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                 )}
            </div>
        </div>
    );
};