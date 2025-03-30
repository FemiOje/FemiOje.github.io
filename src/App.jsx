import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import Footer from './components/Footer';

const projects = {
  smartContracts: [
    {
      title: "Student Registry Contract",
      description: "Student registry smart contract built to maintain student data on Starknet.",
      technologies: ["Cairo", "Scarb", "Snforge", "Starkli"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://github.com/FemiOje/student_registry_contract",
      github: "https://github.com/FemiOje/student_registry_contract"
    },
    {
      title: "Student Registry Frontend",
      description: "Frontend interface to update and maintain student data on a smart contract deployed Starknet.",
      technologies: ["ReactJS", "Typescript", "TailwindCSS", "Starknet-React"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://student-registry-frontend.vercel.app/",
      github: "https://github.com/FemiOje/student-registry-frontend"
    },
    {
      title: "Bookstore Contract",
      description: "Cairo smart contract built to maintain book data on Starknet.",
      technologies: ["Cairo", "Scarb", "Snforge", "Starkli"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://student-registry-frontend.vercel.app/",
      github: "https://github.com/FemiOje/bookstore"
    }
  ],
  gameDevelopment: [
    {
      title: "FishFest Game Jam Submission",
      description: "Immersive 2-D underwater casual endless runner game",
      technologies: ["Unity", "C#", "2-D", "Casual", "Endless"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://femioje.itch.io/fishfest-gamejamnew-build",
      github: "https://github.com/FemiOje/Fish-Fest-Game-Jam"
    },
    {
      title: "Adventure of the Thing",
      description: "2-D adventure game with combat physics.",
      technologies: ["Unity", "C#", "Action", "Combat", "Survival"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://femioje.itch.io/adventure-of-the-thing",
      github: "https://github.com/FemiOje"
    },
    {
      title: "Pong Game Clone",
      description: "2-D pong game clone.",
      technologies: ["Unity", "C#", "Casual"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://femioje.itch.io/pong-clone",
      github: "https://github.com/FemiOje"
    }
  ],
  webDevelopment: [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce platform with real-time inventory",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://github.com/yourusername/ecommerce",
      github: "https://github.com/FemiOje"
    },
    {
      title: "Social Media Dashboard",
      description: "A real-time social media analytics dashboard",
      technologies: ["Vue.js", "D3.js", "Firebase", "Tailwind CSS"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://github.com/yourusername/social-dashboard",
      github: "https://github.com/FemiOje"
    }
  ],
  others: [
    {
      title: "Mobile App",
      description: "A cross-platform mobile app for task management",
      technologies: ["React Native", "Redux", "Firebase"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://github.com/yourusername/task-app",
      github: "https://github.com/FemiOje"
    },
    {
      title: "AI Chat Bot",
      description: "An AI-powered chatbot using natural language processing",
      technologies: ["Python", "TensorFlow", "Flask", "React"],
      imageUrl: "https://via.placeholder.com/400x300",
      projectUrl: "https://github.com/yourusername/ai-chatbot",
      github: "https://github.com/FemiOje"
    }
  ]
};

const categories = [
  { id: 'smartContracts', name: 'Smart Contracts' },
  { id: 'gameDevelopment', name: 'Game Development' },
  { id: 'webDevelopment', name: 'Web Development' },
  { id: 'others', name: 'Others' }
];

function App() {
  const [activeCategory, setActiveCategory] = useState('smartContracts');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        id="home"
        className="pt-20 pb-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome to My Portfolio
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            I&apos;m a passionate software engineering student creating amazing applications across different domains.
          </motion.p>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto text-center">
        <motion.section id="projects" className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4'>
          Projects
        </motion.section>

      {/* Category Navigation */}
      <motion.div
        className="sticky top-[4rem] z-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-4 py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300 ${activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projects Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects[activeCategory].map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      </div>


      {/* Contact Section */}
      <motion.section
        id="contact"
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Get in Touch</h2>
          <p className="text-gray-900 dark:text-white mb-8">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>

          <div>
            <motion.a
              href="https://x.com/0xjinius"
              className="inline-block text-white bg-blue-600 px-8 py-3 m-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              X/Twitter
            </motion.a>

            <motion.a
              href="https://github.com/FemiOje"
              className="inline-block text-white bg-blue-600 px-8 py-3 m-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Github
            </motion.a>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

export default App;
