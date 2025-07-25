import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import { db } from "@/server/db";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
};

interface MinimalNoticeMarqueeProps {
  fallback: React.ComponentType;
}

export default async function MinimalNoticeMarquee({
  fallback: Fallback,
}: MinimalNoticeMarqueeProps) {
  let news: NewsItem[] = [];
  let error = "";

  try {
    news = await db.news.findMany({
      take: 30,
      where: {
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });
  } catch (err) {
    error = "Error loading latest news";
    console.error(err);
  }

  if (error || news.length === 0) {
    return <Fallback />;
  }

  return (
    <div className="container mx-auto mt-6 overflow-hidden">
      <div className="flex items-center border-b border-gray-200 py-2">
        <div className="flex-shrink-0 flex items-center space-x-2 pr-4 border-r border-gray-200">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="font-medium text-gray-700 whitespace-nowrap">
            সর্বশেষ
          </span>
        </div>
        <div className="flex-1 pl-4">
          <Marquee
            speed={30}
            gradient={true}
            gradientColor="#F9FAFB"
            pauseOnHover
            className="overflow-hidden"
          >
            <div className="flex items-center space-x-8">
              {news.map((item, index) => (
                <div key={item.id} className="flex items-center flex-shrink-0">
                  {index > 0 && <span className="text-gray-400 mx-4">|</span>}
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap"
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </div>
  );
}
