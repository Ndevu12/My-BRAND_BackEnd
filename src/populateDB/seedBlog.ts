import { Blog } from "../models/Blog";

const seedBlog = async () => {
  try {
    const BlogData = [
      {
        title: "Introduction to Programming",
        content: "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
        description: "An introductory guide to programming, covering the basics and fundamental concepts.",
        tags: ["Programming", "Basics"],
      },
      {
        title: "Advanced JavaScript Techniques",
        content: "This blog covers advanced JavaScript techniques including closures, promises, and async/await.",
        description: "A deep dive into advanced JavaScript techniques for experienced developers.",
        tags: ["JavaScript", "Advanced"],
      },
      {
        title: "Understanding Machine Learning",
        content: "Machine learning is a branch of artificial intelligence that focuses on building systems that learn from data.",
        description: "An overview of machine learning concepts and applications.",
        tags: ["Machine Learning", "AI"],
      },
      {
        title: "Web Development with React",
        content: "React is a popular JavaScript library for building user interfaces, particularly for single-page applications.",
        description: "A comprehensive guide to web development using React.",
        tags: ["Web Development", "React"],
      },
      {
        title: "Data Science with Python",
        content: "Python is a versatile programming language that is widely used in data science for data analysis, visualization, and machine learning.",
        description: "An introduction to data science using Python.",
        tags: ["Data Science", "Python"],
      },
    ];

    await Blog.insertMany(BlogData);

    console.log("Blog seeded successfully!");
  } catch (error) {
    console.error(
      "Error seeding Blog:\n",
      { error: (error as Error).message },
      error
    );
  }
};

// Seed Blog
export { seedBlog };