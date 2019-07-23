const fetch = require('node-fetch');

const findAuthors = data => {
    const authors = [];
    Object.keys(data).forEach(key => {
        if (key === 'author') return authors.push(data[key]);
        if (typeof data[key] === 'object' && data[key]) authors.push(...findAuthors(data[key]));
    });
    return authors;
};

const getUserActivity = async username => {
    const resp = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`);
    return resp.json();
};

const relevantEmails = (user, authors) => {
    return authors
        .filter(item => {
            return item.name.toLowerCase().trim() === user.login.toLowerCase().trim() ||
                item.name.toLowerCase().trim() === user.name.toLowerCase().trim()
        })
        .map(item => item.email);
};

const getUser = async username => {
    const resp = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    return resp.json();
};

const findEmails = async username => {
    const activity = await getUserActivity(username);
    const authors = findAuthors(activity);
    const user = await getUser(username);
    const emails = [user.email, ...relevantEmails(user, authors)];
    return [...new Set(emails)].filter(item => item);
};

findEmails('MattIPv4').then(emails => console.log(emails));
