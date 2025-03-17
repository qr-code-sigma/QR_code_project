## About
This project is a web application created by a group of 8 students as a part of a university project.  
The application provides event management software for corporations and organizations that host events.  

### Features:
- **Event types**: Public and private events  
- **User authentication**: Registration and login required  
- **Event registration**: Users can register for events  
- **QR Code badges**: Automatically generated QR codes for registered users  
- **PDF Export**: Users can download their QR badge as a PDF  
- **User profiles**: View past and upcoming event registrations
- **Admin users**: Admin users can remove or edit events

## Details  

The project is built using the following technologies:  
- **Backend**: Django, Django REST Framework  
- **Frontend**: React, Axios, Redux  
- **Database**: PostgreSQL  
- **Authentication**: Session-based  
- **Others**: Redis (used for caching)  

The backend is deployed on **Railway**, and the frontend is deployed on **Netlify**.  
Project management and task tracking were organized using **Jira**. 

🔗 **Live Project:** [QR Code Project](https://qr-code-project-sigma.netlify.app/)  

## Team  
This project was developed by a team of 8 students as part of a university collaboration.  

### Contributors:
- **Pavlo Khoroshun** - PM, backend
- **Vitalii Pokhodun** – Backend  
- **Margaryta Filipovych** – Backend, Database  
- **Nikita Shulha** – Frontend  
- **Davyd Breskiv** - Frontend  
- **Danil Kuzma** – Frontend, UI/UX  
- **Sofia Churikova** – Deployment, UI/UX  
- **Ksenia Hanziuk** – QA

If you want to use it locally:

```git clone https://github.com/qr-code-sigma/QR_code_project
cd QR_code_project/backend
pip install -r requirements.txt`
```
Then you have to create .env file and generate a secret key with
`python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
`
and add
`export SECRET_KEY = {your generated key}`
Then add your database URL to .env file
`export DATABSE_URL = {your database url}`
and run 
`python manage.py runserver`

Then to aunch frontend
```
cd ../frontend
npm install
npm run dev
```


#WARNING: **If you are using iOS make sure to disable "Prevent Cross Site Tracking" in settings. If you are using MacOS the application may not work in Safari and Chrome**
