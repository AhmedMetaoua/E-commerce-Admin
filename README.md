# E-commerce Admin Dashboard

A modern and powerful admin dashboard for managing e-commerce operations, built with Next.js and React.

## 🚀 Features

- **Authentication System**
  - Secure login and registration
  - Password reset functionality
  - Protected routes

- **Product Management**
  - Create, read, update, and delete products
  - Product categorization
  - Image upload support

- **Order Management**
  - Track and manage orders
  - Order status updates
  - Order details view

- **Category Management**
  - Organize products with categories
  - Hierarchical category structure

- **Settings**
  - User profile management
  - System configuration
  - Preferences

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 15.2.4
  - React 19
  - Tailwind CSS
  - Radix UI Components
  - Recharts for data visualization

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - NextAuth.js for authentication
  - AWS S3 for file storage
  - Cloudinary for image management

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd e-commerce-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
e-commerce-admin/
├── components/     # Reusable UI components
├── pages/         # Next.js pages and API routes
├── lib/           # Utility functions and configurations
├── models/        # MongoDB models
├── public/        # Static assets
├── styles/        # Global styles and Tailwind config
└── ...
```

## 🔒 Security

- Authentication using NextAuth.js
- Password hashing with bcryptjs
- Protected API routes
- Secure file upload handling
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- All open-source libraries used in this project

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


## Support

For support, email ahmedmtawahg@gmail.com or open an issue in the repository.

## 👥 Authors

- Ahmed Metaoua - Initial work


