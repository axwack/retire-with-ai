import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    "All",
    "Social Security",
    "Investments",
    "Healthcare",
    "Estate Planning",
    "Tax Strategies",
  ];

  const posts: BlogPost[] = [
    {
      id: "1",
      title: "When to Start Claiming Social Security: A Complete Guide",
      excerpt: "Understanding the best time to claim Social Security can significantly impact your retirement income. Learn the key factors to consider.",
      category: "Social Security",
      author: "Sarah Mitchell",
      date: "December 15, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
      featured: true,
    },
    {
      id: "2",
      title: "Building a Tax-Efficient Retirement Portfolio",
      excerpt: "Discover strategies to minimize taxes in retirement through smart asset allocation and withdrawal sequencing.",
      category: "Tax Strategies",
      author: "Michael Chen",
      date: "December 12, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
    },
    {
      id: "3",
      title: "Medicare vs. Medicare Advantage: Making the Right Choice",
      excerpt: "Navigate the complex world of Medicare options to find the coverage that best fits your healthcare needs.",
      category: "Healthcare",
      author: "Dr. Emily Roberts",
      date: "December 10, 2024",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    },
    {
      id: "4",
      title: "Estate Planning Essentials for Retirees",
      excerpt: "Protect your legacy with these essential estate planning steps every retiree should take.",
      category: "Estate Planning",
      author: "James Wilson",
      date: "December 8, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    },
    {
      id: "5",
      title: "The 4% Rule: Is It Still Relevant?",
      excerpt: "Examining the classic retirement withdrawal strategy and whether it holds up in today's economic environment.",
      category: "Investments",
      author: "Sarah Mitchell",
      date: "December 5, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    },
    {
      id: "6",
      title: "Maximizing Your Employer 401(k) Match",
      excerpt: "Don't leave free money on the table. Learn how to maximize your employer's retirement contributions.",
      category: "Investments",
      author: "Michael Chen",
      date: "December 3, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800",
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find((post) => post.featured);

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            <span>Retirement Insights</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            The RetireWise Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Expert insights, strategies, and tips to help you navigate your retirement journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "sage" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category === "All" ? null : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && !searchQuery && !selectedCategory && (
          <Card className="mb-12 overflow-hidden border-border hover:shadow-medium transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-4 bg-gold/10 text-gold border-gold/20">
                  Featured
                </Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span>{featuredPost.author}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Link to={`/blog/${featuredPost.id}`}>
                  <Button variant="hero" className="w-fit gap-2">
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(p => !p.featured || searchQuery || selectedCategory).map((post) => (
            <Card key={post.id} className="overflow-hidden border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3 bg-sage-light text-sage-dark">
                  {post.category}
                </Badge>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your search.</p>
          </div>
        )}

        {/* WordPress Integration Note */}
        <div className="mt-16 bg-card border border-border rounded-xl p-8 text-center max-w-2xl mx-auto">
          <h3 className="font-display text-xl font-semibold text-foreground mb-3">
            WordPress Integration Ready
          </h3>
          <p className="text-muted-foreground text-sm">
            This blog is designed to integrate seamlessly with WordPress via REST API. 
            Connect your WordPress backend to manage content effortlessly.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
