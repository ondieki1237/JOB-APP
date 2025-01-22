const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

const dummyJobs = [
  {
    title: "Full Stack Developer",
    description: "Looking for an experienced full stack developer to join our team. Must have experience with React and Node.js.",
    skillsRequired: ["React", "Node.js", "MongoDB", "TypeScript"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Nairobi, Kenya",
    budget: {
      min: 1000,
      max: 2000
    },
    duration: "Monthly",
    companyDetails: {
      name: "Tech Solutions Ltd",
      description: "Leading software development company"
    },
    requirements: {
      experience: "Mid-Level",
      education: "Bachelor's Degree",
      certifications: ["AWS Certified"]
    },
    status: "Open"
  },
  {
    title: "Mobile App Developer",
    description: "Seeking a mobile developer with React Native experience for our healthcare app.",
    skillsRequired: ["React Native", "JavaScript", "iOS", "Android"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Mombasa, Kenya",
    budget: {
      min: 800,
      max: 1500
    },
    duration: "Fixed",
    companyDetails: {
      name: "Health Tech Inc",
      description: "Healthcare technology solutions"
    },
    requirements: {
      experience: "Senior-Level",
      education: "Bachelor's Degree",
      certifications: []
    },
    status: "Open"
  },
  {
    title: "UI/UX Designer",
    description: "Looking for a creative UI/UX designer to help design our new product.",
    skillsRequired: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Kisumu, Kenya",
    budget: {
      min: 500,
      max: 1000
    },
    duration: "Weekly",
    companyDetails: {
      name: "Creative Design Studio",
      description: "Digital design agency"
    },
    requirements: {
      experience: "Entry-Level",
      education: "Diploma",
      certifications: ["Google UX Design"]
    },
    status: "Open"
  },
  {
    title: "DevOps Engineer",
    description: "Seeking a DevOps engineer to help with our cloud infrastructure.",
    skillsRequired: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Nakuru, Kenya",
    budget: {
      min: 1200,
      max: 2500
    },
    duration: "Monthly",
    companyDetails: {
      name: "Cloud Solutions Kenya",
      description: "Cloud infrastructure company"
    },
    requirements: {
      experience: "Senior-Level",
      education: "Master's Degree",
      certifications: ["AWS Solutions Architect"]
    },
    status: "Open"
  },
  {
    title: "Data Scientist",
    description: "Looking for a data scientist with machine learning experience.",
    skillsRequired: ["Python", "TensorFlow", "SQL", "Machine Learning"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Eldoret, Kenya",
    budget: {
      min: 1500,
      max: 3000
    },
    duration: "Monthly",
    companyDetails: {
      name: "Data Analytics Pro",
      description: "Data analytics consulting firm"
    },
    requirements: {
      experience: "Mid-Level",
      education: "PhD",
      certifications: ["TensorFlow Developer"]
    },
    status: "Open"
  },
  {
    title: "Backend Developer",
    description: "Backend developer needed for e-commerce platform development.",
    skillsRequired: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Thika, Kenya",
    budget: {
      min: 900,
      max: 1800
    },
    duration: "Monthly",
    companyDetails: {
      name: "E-Commerce Solutions",
      description: "E-commerce technology provider"
    },
    requirements: {
      experience: "Mid-Level",
      education: "Bachelor's Degree",
      certifications: []
    },
    status: "Open"
  },
  {
    title: "Frontend Developer",
    description: "Frontend developer needed for web application development.",
    skillsRequired: ["React", "Vue.js", "CSS", "JavaScript"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Machakos, Kenya",
    budget: {
      min: 700,
      max: 1400
    },
    duration: "Weekly",
    companyDetails: {
      name: "Web Tech Solutions",
      description: "Web development company"
    },
    requirements: {
      experience: "Entry-Level",
      education: "Diploma",
      certifications: []
    },
    status: "Open"
  },
  {
    title: "System Administrator",
    description: "Looking for a system administrator to manage our IT infrastructure.",
    skillsRequired: ["Linux", "Windows Server", "Networking", "Security"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Kisii, Kenya",
    budget: {
      min: 800,
      max: 1600
    },
    duration: "Monthly",
    companyDetails: {
      name: "IT Systems Pro",
      description: "IT infrastructure management"
    },
    requirements: {
      experience: "Mid-Level",
      education: "Bachelor's Degree",
      certifications: ["CompTIA A+"]
    },
    status: "Open"
  },
  {
    title: "QA Engineer",
    description: "QA engineer needed for software testing and quality assurance.",
    skillsRequired: ["Selenium", "Jest", "Manual Testing", "API Testing"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Malindi, Kenya",
    budget: {
      min: 600,
      max: 1200
    },
    duration: "Monthly",
    companyDetails: {
      name: "Quality Tech",
      description: "Software quality assurance"
    },
    requirements: {
      experience: "Entry-Level",
      education: "Bachelor's Degree",
      certifications: ["ISTQB"]
    },
    status: "Open"
  },
  {
    title: "Technical Writer",
    description: "Technical writer needed for software documentation.",
    skillsRequired: ["Technical Writing", "Markdown", "Documentation", "Git"],
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
    locationName: "Nyeri, Kenya",
    budget: {
      min: 500,
      max: 1000
    },
    duration: "Weekly",
    companyDetails: {
      name: "Doc Solutions",
      description: "Technical documentation services"
    },
    requirements: {
      experience: "Entry-Level",
      education: "Bachelor's Degree",
      certifications: []
    },
    status: "Open"
  }
];

const seedJobs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Create a default user for the jobs
    const defaultUserId = new mongoose.Types.ObjectId();

    // Add the user ID to each job
    const jobsWithUser = dummyJobs.map(job => ({
      ...job,
      postedBy: defaultUserId
    }));

    // Insert the jobs
    await Job.insertMany(jobsWithUser);
    console.log('Successfully seeded jobs');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

seedJobs(); 