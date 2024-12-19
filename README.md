# Scholar Sync

Scholar Sync is a cloud-based educational platform developed using the MERN stack. It empowers users to create, consume, and rate educational content while fostering collaboration between learners and educators globally.

## Features
- **Content Creation**: Users can easily create educational materials and share them with the community.
- **Content Consumption**: Explore and engage with a wide range of learning resources.
- **Rating System**: Rate and review content to provide feedback and maintain quality.
- **Global Collaboration**: Seamless interaction between learners and educators across the globe.
- **Accessibility & Interactivity**: Designed to enhance user experience with accessible and interactive features.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Hosting**: Cloud-based platform for scalability and reliability

## Installation

### Prerequisites
- Node.js installed on your machine
- MongoDB instance set up locally or in the cloud

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/TushtiKulshreshtha/ScholarSync-Platform.git
   ```
2. Navigate to the project directory:
   ```bash
   cd scholar-sync
   ```
3. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
4. Set up environment variables for the server:
   - Create a `.env` file in the `server` directory.
   - Add the following variables:
     ```env
     MONGO_URI=your-mongodb-uri
     PORT=5000
     ```
5. Start the application:
   ```bash
   # Start the server
   cd server
   npm start

   # Start the client
   cd ../client
   npm start
   ```

## Usage
- Navigate to `http://localhost:3000` to access the platform.
- Sign up or log in to create and explore content.
- Rate and interact with educational resources.

## Contributing
We welcome contributions! Please fork the repository and create a pull request with your feature or improvement.

---
**Developed by**: Tushti Kulshreshtha
