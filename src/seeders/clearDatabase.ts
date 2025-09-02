/**
 * Database clearing utility functions
 * This file provides functions to clear specific collections or the entire database
 */

import { User } from "../models/user";
import { Category } from "../models/blogCategories";
import { Blog } from "../models/Blog";
import { Comment } from "../models/comments";
import { Message } from "../models/messages";
import { Notification } from "../models/notification";
import { Subscriber } from "../models/Subscriber";
import { UserProfile } from "../models/userProfile";

/**
 * Clear all categories from the database
 */
export async function clearCategories() {
  console.log("🗑️  Clearing categories...");
  const result = await Category.deleteMany({});
  console.log(`✅ Cleared ${result.deletedCount} categories`);
  return result.deletedCount;
}

/**
 * Clear all users and user profiles from the database
 */
export async function clearUsers() {
  console.log("🗑️  Clearing users and profiles...");
  const profileResult = await UserProfile.deleteMany({});
  const userResult = await User.deleteMany({});
  console.log(`✅ Cleared ${userResult.deletedCount} users and ${profileResult.deletedCount} profiles`);
  return { users: userResult.deletedCount, profiles: profileResult.deletedCount };
}

/**
 * Clear all blogs and related data
 */
export async function clearBlogs() {
  console.log("🗑️  Clearing blogs and comments...");
  const commentResult = await Comment.deleteMany({});
  const blogResult = await Blog.deleteMany({});
  console.log(`✅ Cleared ${blogResult.deletedCount} blogs and ${commentResult.deletedCount} comments`);
  return { blogs: blogResult.deletedCount, comments: commentResult.deletedCount };
}

/**
 * Clear notifications
 */
export async function clearNotifications() {
  console.log("🗑️  Clearing notifications...");
  const result = await Notification.deleteMany({});
  console.log(`✅ Cleared ${result.deletedCount} notifications`);
  return result.deletedCount;
}

/**
 * Clear messages
 */
export async function clearMessages() {
  console.log("🗑️  Clearing messages...");
  const result = await Message.deleteMany({});
  console.log(`✅ Cleared ${result.deletedCount} messages`);
  return result.deletedCount;
}

/**
 * Clear subscribers
 */
export async function clearSubscribers() {
  console.log("🗑️  Clearing subscribers...");
  const result = await Subscriber.deleteMany({});
  console.log(`✅ Cleared ${result.deletedCount} subscribers`);
  return result.deletedCount;
}

/**
 * Clear entire database in the correct order
 */
export async function clearEntireDatabase() {
  console.log("\n🚨 CLEARING ENTIRE DATABASE 🚨");
  console.log("This operation cannot be undone!");
  
  const results = {
    comments: 0,
    blogs: 0,
    categories: 0,
    notifications: 0,
    messages: 0,
    subscribers: 0,
    profiles: 0,
    users: 0
  };

  try {
    // Clear in dependency order
    const commentResult = await Comment.deleteMany({});
    results.comments = commentResult.deletedCount;
    console.log(`✅ Cleared ${commentResult.deletedCount} comments`);
    
    const blogResult = await Blog.deleteMany({});
    results.blogs = blogResult.deletedCount;
    console.log(`✅ Cleared ${blogResult.deletedCount} blogs`);
    
    const categoryResult = await Category.deleteMany({});
    results.categories = categoryResult.deletedCount;
    console.log(`✅ Cleared ${categoryResult.deletedCount} categories`);
    
    const notificationResult = await Notification.deleteMany({});
    results.notifications = notificationResult.deletedCount;
    console.log(`✅ Cleared ${notificationResult.deletedCount} notifications`);
    
    const messageResult = await Message.deleteMany({});
    results.messages = messageResult.deletedCount;
    console.log(`✅ Cleared ${messageResult.deletedCount} messages`);
    
    const subscriberResult = await Subscriber.deleteMany({});
    results.subscribers = subscriberResult.deletedCount;
    console.log(`✅ Cleared ${subscriberResult.deletedCount} subscribers`);
    
    const profileResult = await UserProfile.deleteMany({});
    results.profiles = profileResult.deletedCount;
    console.log(`✅ Cleared ${profileResult.deletedCount} user profiles`);
    
    const userResult = await User.deleteMany({});
    results.users = userResult.deletedCount;
    console.log(`✅ Cleared ${userResult.deletedCount} users`);
    
    const totalCleared = Object.values(results).reduce((sum, count) => sum + count, 0);
    console.log(`\n🎉 Database cleared successfully! Total records removed: ${totalCleared}`);
    
    return results;
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
}
