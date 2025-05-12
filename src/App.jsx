import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import projects from './data/ProjectsData.json';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import Footer from './components/Footer';

const categories = [
  { id: 'smartContracts', name: 'Smart Contracts' },
  { id: 'gameDevelopment', name: 'Game Development' },
  { id: 'webDevelopment', name: 'Web Development' },
  { id: 'school', name: 'Group Projects/ School' }
];

function App() {
  const [activeCategory, setActiveCategory] = useState('smartContracts');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        id="home"
        className="pt-20 pb-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ohayo👋
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            I&apos;m a computer science student creating amazing applications across different domains. My skills/interests include but are not limited to the following:
          </motion.p>
          <motion.ul className="text-xl text-gray-600 dark:text-gray-300 mb-8 list-disc">
            <motion.li><strong>Frontend web development,</strong> with HTML, CSS, Javascript, ReactJS, PHP, SQL</motion.li>
            <motion.li><strong>Game development:</strong> Unity, C#, Dojo</motion.li>
            <motion.li><strong>Smart Contract development</strong> with Cairo and fully onchain games with the Dojo Game Engine</motion.li>
          </motion.ul>
        </div>
      </motion.section>

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h4 
            id="projects" 
            className="text-4xl md:text-6xl font-normal text-gray-900 dark:text-white mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Check out some personal and group projects I have worked on:
          </motion.h4>
        </div>

        {/* Category Navigation */}
        <motion.div
          className="sticky top-[4rem] z-10 w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-8"
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
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Section */}
        <div className="max-w-7xl mx-auto px-4">
          <section className="py-8">
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
          </section>
        </div>
      </div>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="py-16 px-4 bg-gray-300 dark:bg-gray-800 mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold dark:text-amber-500 mb-8">Get in Touch</h2>
          <p className="mb-8 dark:text-white">
            I am always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://x.com/0xjinius"
              className="inline-block text-white bg-blue-700 hover:bg-blue-800 dark:bg-amber-400 px-8 py-3 rounded-full font-semibold transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              X/Twitter
            </motion.a>

            <motion.a
              href="https://github.com/FemiOje"
              className="inline-block text-white bg-blue-700 hover:bg-blue-800 dark:bg-amber-400 px-8 py-3 rounded-full font-semibold transition-colors duration-300"
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
