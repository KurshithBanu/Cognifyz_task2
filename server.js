const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

let submissions = [];

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', (req, res) => {
    const { name, email, phone, gender, nationality, comments } = req.body;

    // Server-side validation
    const errors = [];
    if (!name || !email || !phone || !gender || !nationality) {
        errors.push("All required fields must be filled!");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.push("Invalid email format!");
    }
    if (!/^\d{10}$/.test(phone)) {
        errors.push("Phone number must be 10 digits!");
    }
    if (errors.length > 0) {
        res.status(400).send(`
            <h1>Error</h1>
            <p style="color: rgb(250, 58, 58);">
                ${errors.join('<br>')}
            </p>
            <a href="/">Back to the form</a>
        `);
        return;
    }
    

    // Store validated data in temporary storage
    submissions.push({ name, email, phone, gender, nationality, comments: comments || "No comments" });

    res.send(`
        <h1>Thank You!</h1>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone Number: ${phone}</p>
        <p>Gender: ${gender}</p>
        <p>Nationality: ${nationality}</p>
        <p>Comments: ${comments || "No comments"}</p>
        <a href="/">Back to the form</a>
        <br>
        <a href="/submissions">View All Submissions</a>
    `);
});

app.get('/submissions', (req, res) => {
    res.send(`
        <h1>All Submissions</h1>
        <ul>
            ${submissions.map(submission => `
                <li>
                    <strong>${submission.name}</strong>, ${submission.email}, ${submission.phone},
                    ${submission.gender}, ${submission.nationality}, Comments: ${submission.comments}
                </li>
            `).join('')}
        </ul>
        <a href="/">Back to the form</a>
    `);
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
