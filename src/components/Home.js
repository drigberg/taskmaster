
import React from 'react';

export default function Home() {
    const username = 'LukeSkywalker';
    return (<div>
        <h1>Task Master</h1>
        <h2>Welcome, {username}!</h2>
        <a href="/login/"><button>Sign In / Register</button></a>
        <a href="/dashboard/"><button>Dashboard</button></a>
    </div>);
}
