import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2 } from 'lucide-react';

const UseCases = () => {
  const creators = [
    {
      name: 'Lana',
      role: '🎥 Photographer',
      avatar: 'https://images.unsplash.com/photo-1618661148759-0d481c0c2116?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Earned $2,400 this month',
      content: 'https://images.unsplash.com/photo-1759767510137-5789ea9c919f?w=600&h=400&fit=crop'
    },
    {
      name: 'Lizza',
      role: '🎨 Designer',
      avatar: 'https://images.pexels.com/photos/15340590/pexels-photo-15340590.jpeg?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Earned $540 last week',
      content: 'https://images.unsplash.com/photo-1641886336879-340cc977163c?w=600&h=400&fit=crop'
    },
    {
      name: 'Anastasia',
      role: '🤳🏻 Content Creator',
      avatar: 'https://images.pexels.com/photos/15340593/pexels-photo-15340593.jpeg?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Earned $310 in 3 days',
      content: 'https://images.unsplash.com/photo-1664277497095-424e085175e8?w=600&h=400&fit=crop'
    },
    {
      name: 'Noah',
      role: '🎥 Videographer',
      avatar: 'https://images.unsplash.com/photo-1630797160666-38e8c5ba44c1?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Earned $726 in 2 weeks',
      content: 'https://images.pexels.com/photos/12432848/pexels-photo-12432848.jpeg?w=600&h=400&fit=crop'
    },
    {
      name: 'Alex',
      role: '🏛️ Architect',
      avatar: 'https://images.unsplash.com/photo-1627244714766-94dab62ed964?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Earned $670 in 5 days',
      content: 'https://images.unsplash.com/photo-1564518534518-e79657852a1a?w=600&h=400&fit=crop'
    },
    {
      name: 'Sophia',
      role: '🧑‍🎨 Motion Designer',
      avatar: 'https://images.pexels.com/photos/7514814/pexels-photo-7514814.jpeg?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Made $890 in 14 days',
      content: 'https://images.unsplash.com/photo-1636971828014-0f3493cba88a?w=600&h=400&fit=crop'
    },
    {
      name: 'Tomas',
      role: '💪 Fitness trainer',
      avatar: 'https://images.unsplash.com/photo-1704223523169-52feeed90365?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Earned $980 in 2 weeks',
      content: 'https://images.unsplash.com/photo-1648542036561-e1d66a5ae2b1?w=600&h=400&fit=crop'
    },
    {
      name: 'James',
      role: '💻 Online Coach',
      avatar: 'https://images.pexels.com/photos/6922159/pexels-photo-6922159.jpeg?w=400&h=400&fit=crop&crop=faces',
      earnings: 'Earned $989 in the past week',
      content: 'https://images.pexels.com/photos/7514814/pexels-photo-7514814.jpeg?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Use Cases
          </h3>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            From Links to Earnings
          </h2>
          <p className="text-xl text-gray-600">
            Share links that unlock anything anywhere at anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.map((creator, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-gray-200"
            >
              <div className="relative">
                <img 
                  src={creator.content} 
                  alt={creator.name}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-gray-900">{creator.name}</h4>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600">{creator.role}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="w-full justify-center py-2 bg-green-50 text-green-700 hover:bg-green-100">
                  {creator.earnings}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;