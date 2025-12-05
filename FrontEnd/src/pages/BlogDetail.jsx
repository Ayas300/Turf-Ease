import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.css';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Extended blog data with full content
  const blogData = {
    1: {
      id: 1,
      title: "Exploring the Top Futsal Fields Around Chittagong",
      excerpt: "Discover the best futsal venues in Chittagong with state-of-the-art facilities, perfect lighting, and professional-grade surfaces that will elevate your game to the next level.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
      category: "Chittagong",
      author: "Sports Team",
      date: "Dec 15, 2024",
      readTime: 5,
      content: `
        <p>Futsal, a fast-paced, exciting variant of football played on smaller, hard-surface pitches, has gained immense popularity in Chittagong. Whether you're a seasoned player or a casual enthusiast, finding the right futsal field can elevate your game. In this blog, we dive into the top futsal fields in Chittagong, focusing on their amenities, ratings, and unique offerings to help you choose the perfect turf for your next match.</p>
        
        <h3>Why Futsal in Chittagong?</h3>
        <p>Chittagong, a bustling port city, is home to a vibrant sports culture, with futsal fields popping up to cater to the growing demand. These turfs offer modern facilities, convenient locations, and a variety of amenities, making them ideal for both competitive matches and friendly kickabouts. Below, we explore five top-rated futsal fields in Chittagong, all of which are either dedicated football turfs or multi-sport facilities that support futsal.</p>
        
        <h3>Top Futsal Fields in Chittagong</h3>
        
        <h4>1. Chattoground</h4>
        <p><strong>Rating:</strong> 4.9/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> Parking, Cafeteria, AC, Changing Room<br>
        <strong>Contact:</strong> +880 1756-789012 | reservations@Chattoground.com</p>
        <p>Chattoground is a standout choice for futsal enthusiasts in Chittagong, boasting an impressive 4.9 rating. This multi-sport facility is equipped with top-notch amenities, including air-conditioned changing rooms and a cafeteria for post-game refreshments. The well-maintained turf and ample parking make it a favorite for both casual players and organized teams. Whether you're planning a late-night game under the lights or a weekend tournament, Chattoground delivers an exceptional experience.</p>
        
        <h4>2. The Green Field</h4>
        <p><strong>Rating:</strong> 4.7/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> Parking, Cafeteria, AC, Changing Room, Lighting<br>
        <strong>Contact:</strong> +880 1778-901234 | elite@TheGreenField.com</p>
        <p>The Green Field is another premier multi-sport venue in Chittagong, with a stellar 4.7 rating. Its comprehensive amenities, including floodlights for evening games and a cozy cafeteria, make it a go-to spot for futsal players. The turf's high-quality surface ensures smooth gameplay, and the availability of air-conditioned facilities adds comfort, especially during Chittagong's humid months. It's an excellent choice for players seeking a professional-grade experience.</p>
        
        <h4>3. Turf Bakalia</h4>
        <p><strong>Rating:</strong> 4.6/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> AC, Changing Room, Lighting, Parking<br>
        <strong>Contact:</strong> +880 1801-234567 | TurfBakalia@gmail.com</p>
        <p>Turf Bakalia offers a fantastic multi-sport facility with a 4.6 rating, perfect for futsal lovers. The turf is well-lit, allowing for evening matches, and the air-conditioned changing rooms provide a comfortable space to gear up. With ample parking, it's convenient for groups arriving by car. Turf Bakalia is known for its vibrant atmosphere, making it ideal for both competitive matches and social gatherings.</p>
        
        <h4>4. Sports Club CTG</h4>
        <p><strong>Rating:</strong> 4.5/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> Parking, Lighting, Changing Room<br>
        <strong>Contact:</strong> +880 1712-345678 | info@sportsclubctg.com</p>
        <p>Sports Club CTG is a dedicated football turf with a solid 4.5 rating, making it a reliable choice for futsal players. The facility offers essential amenities like parking, lighting, and changing rooms, ensuring a hassle-free experience. Its central location in Chittagong makes it easily accessible, and the well-maintained pitch is perfect for fast-paced futsal action. This turf is a great pick for players looking for a no-frills, high-quality venue.</p>
        
        <h4>5. ACM Turf</h4>
        <p><strong>Rating:</strong> 4.4/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> Parking, Lighting, Cafeteria<br>
        <strong>Contact:</strong> +880 1790-123456 | community@AcmTurf.com</p>
        <p>ACM Turf rounds out our list with a respectable 4.4 rating. This football-specific turf is well-suited for futsal, offering a quality playing surface and essential amenities like parking and lighting. The on-site cafeteria is a bonus for players looking to grab a snack after their game. ACM Turf's community-focused vibe makes it a popular choice for local futsal leagues and friendly matches.</p>
        
        <h3>Choosing the Right Futsal Field</h3>
        <p>When selecting a futsal field in Chittagong, consider the following factors:</p>
        <ul>
          <li><strong>Amenities:</strong> Look for turfs with lighting for evening games, changing rooms for convenience, and cafeterias for refreshments.</li>
          <li><strong>Location:</strong> All listed turfs are in Chittagong, ensuring easy access for local players.</li>
          <li><strong>Rating:</strong> Higher-rated fields like Chattoground (4.9) and The Green Field (4.7) often indicate better maintenance and player satisfaction.</li>
          <li><strong>Price:</strong> Prices vary based on ratings and amenities, so contact the venues directly for the latest rates.</li>
        </ul>
        
        <h3>Final Thoughts</h3>
        <p>Chittagong's futsal scene is thriving, with top-tier facilities like Chattoground, The Green Field, and Turf Bakalia leading the way. Whether you prioritize premium amenities, high ratings, or a community atmosphere, there's a turf in Chittagong to suit your needs. Grab your boots, gather your team, and book a slot at one of these fantastic venues for an unforgettable futsal experience!</p>
        
        <p>For bookings or inquiries, reach out to the respective turfs via their contact details. Have a favorite futsal spot in Chittagong we missed? Let us know in the comments!</p>
      `
    },
    2: {
      id: 2,
      title: "Top 3 Futsal Fields in Sylhet: Where to Play Your Best Game",
      excerpt: "From premium indoor courts to outdoor fields with stunning views, explore Sylhet's finest futsal destinations that offer exceptional playing experiences for all skill levels.",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80",
      category: "Sylhet",
      author: "Field Expert",
      date: "Dec 12, 2024",
      readTime: 5,
      content: `
        <p>Futsal, the fast-paced, skill-driven cousin of football, has taken Sylhet by storm. With its compact pitches and intense gameplay, futsal is perfect for players looking to hone their skills or enjoy a fun match with friends. Sylhet boasts several top-notch turfs that cater to futsal enthusiasts, offering modern facilities and vibrant atmospheres. In this blog, we explore the top three futsal fields in Sylhet, highlighting their ratings, amenities, and unique features to help you pick the perfect spot for your next game.</p>
        
        <h3>Why Futsal in Sylhet?</h3>
        <p>Sylhet's sports scene is thriving, with futsal fields gaining popularity for their accessibility and quality. Whether you're a local or visiting the city, these turfs provide excellent facilities for both competitive matches and casual kickabouts. From air-conditioned changing rooms to well-lit pitches for evening games, Sylhet's futsal venues have it all. Let's dive into the top three futsal fields, ranked by their ratings and amenities.</p>
        
        <h3>Top 3 Futsal Fields in Sylhet</h3>
        
        <h4>1. Sylhet Premier Ground</h4>
        <p><strong>Rating:</strong> 4.8/5<br>
        <strong>Location:</strong> Sylhet<br>
        <strong>Amenities:</strong> AC, Cafeteria, Lighting, Changing Room, Parking<br>
        <strong>Contact:</strong> +880 1923-456789 | premier@sylhetground.com</p>
        <p>Sylhet Premier Ground tops the list with an impressive 4.8 rating, making it the premier choice for futsal players. This football-specific turf offers a top-tier experience with a wide range of amenities, including air-conditioned facilities, a cafeteria for post-game snacks, and floodlights for evening matches. The availability of changing rooms and ample parking adds to its convenience, making it ideal for both organized tournaments and spontaneous games. If you're looking for a professional-grade futsal experience, Sylhet Premier Ground is the place to be.</p>
        
        <h4>2. Soccer Zone</h4>
        <p><strong>Rating:</strong> 4.8/5<br>
        <strong>Location:</strong> Sylhet<br>
        <strong>Amenities:</strong> Parking, Cafeteria, AC<br>
        <strong>Contact:</strong> +880 1823-456789 | contact@SoccerZone.com</p>
        <p>Tied with Sylhet Premier Ground at a 4.8 rating, Soccer Zone is another fantastic option for futsal enthusiasts. This dedicated football turf offers a high-quality playing surface, perfect for fast-paced futsal action. With air-conditioned facilities and a cafeteria, it ensures player comfort, though it lacks changing rooms compared to Sylhet Premier Ground. Its central location and vibrant atmosphere make it a popular choice for local futsal leagues and friendly matches.</p>
        
        <h4>3. Sports Heaven Sylhet</h4>
        <p><strong>Rating:</strong> 4.6/5<br>
        <strong>Location:</strong> Sylhet<br>
        <strong>Amenities:</strong> Parking, Lighting<br>
        <strong>Contact:</strong> +880 1845-678901 | booking@SportsHeaven.com</p>
        <p>Sports Heaven Sylhet rounds out the top three with a solid 4.6 rating. As a multi-sport facility, it's well-suited for futsal, offering a reliable and accessible venue. The turf is equipped with lighting for evening games and ample parking, making it convenient for groups. While it has fewer amenities than the top two, its high-quality pitch and welcoming environment make it a great choice for casual players and teams alike.</p>
        
        <h3>Choosing the Right Futsal Field</h3>
        <p>When selecting a futsal field in Sylhet, consider these factors:</p>
        <ul>
          <li><strong>Amenities:</strong> Sylhet Premier Ground stands out for its extensive amenities, including AC and changing rooms, while Soccer Zone and Sports Heaven offer solid basics like parking and lighting.</li>
          <li><strong>Rating:</strong> All three turfs have high ratings (4.6–4.8), indicating excellent maintenance and player satisfaction.</li>
          <li><strong>Accessibility:</strong> All venues are centrally located in Sylhet, ensuring easy access for local players.</li>
          <li><strong>Price:</strong> Prices vary based on ratings and amenities, so contact the turfs directly for the latest rates.</li>
        </ul>
        
        <h3>Final Thoughts</h3>
        <p>Sylhet's futsal scene is vibrant and growing, with top-tier venues like Sylhet Premier Ground, Soccer Zone, and Sports Heaven Sylhet leading the charge. Whether you prioritize premium amenities, a high-quality pitch, or a convenient location, these turfs have something for every futsal player. Grab your gear, rally your team, and book a slot at one of these fantastic fields for an unforgettable game!</p>
        
        <p>For bookings or inquiries, reach out to the turfs via their contact details. Have a favorite futsal spot in Sylhet we missed? Share your thoughts in the comments!</p>
      `
    },
    3: {
      id: 3,
      title: "Best Cricket Grounds for Tournament Play in Chittagong and Sylhet",
      excerpt: "Professional cricket facilities across Bangladesh featuring world-class pitches, modern amenities, and tournament-ready infrastructure for competitive matches.",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      category: "Cricket",
      author: "Cricket Pro",
      date: "Dec 10, 2024",
      readTime: 6,
      content: `
        <p>Cricket is more than just a sport in Bangladesh—it's a passion that brings communities together. For tournament organizers and players, finding the right cricket ground is crucial to ensure a memorable and competitive experience. In Chittagong and Sylhet, several venues stand out for their quality facilities and suitability for tournament play. In this blog, we explore the top cricket grounds in these cities, focusing on their ratings, amenities, and features that make them ideal for hosting tournaments.</p>
        
        <h3>Why Choose Chittagong and Sylhet for Cricket Tournaments?</h3>
        <p>Chittagong and Sylhet are vibrant hubs for sports in Bangladesh, offering well-maintained cricket grounds with modern amenities. These venues cater to both local and regional tournaments, providing quality pitches, ample space for spectators, and essential facilities like parking and changing rooms. Whether you're planning a corporate league, school tournament, or community event, these grounds are equipped to deliver a top-notch experience. Below, we highlight the best cricket grounds based on their suitability for tournament play.</p>
        
        <h3>Top Cricket Grounds for Tournaments</h3>
        
        <h4>1. Futsal Arena Sports Center</h4>
        <p><strong>Rating:</strong> 4.1/5<br>
        <strong>Location:</strong> Sylhet<br>
        <strong>Amenities:</strong> Parking<br>
        <strong>Contact:</strong> +880 1889-012345 | community@sFutsalArenaSportsCenter.com</p>
        <p>Futsal Arena Sports Center in Sylhet is a dedicated cricket facility with a 4.1 rating, making it a solid choice for tournament play. While its amenities are limited to parking, the venue's well-maintained pitch and spacious layout are ideal for hosting competitive matches. Its accessibility in Sylhet makes it convenient for teams and spectators alike. For organizers looking for a straightforward, cricket-focused ground, Futsal Arena is a reliable option.</p>
        
        <h4>2. Tea Garden Sports Field</h4>
        <p><strong>Rating:</strong> 4.3/5<br>
        <strong>Location:</strong> Sylhet<br>
        <strong>Amenities:</strong> Parking, Changing Room<br>
        <strong>Contact:</strong> +880 1812-345678 | teagarden@sportsfield.com</p>
        <p>Tea Garden Sports Field, also in Sylhet, earns a 4.3 rating and is another excellent venue for cricket tournaments. This dedicated cricket ground offers a high-quality playing surface, perfect for competitive matches. The inclusion of changing rooms ensures player comfort, while ample parking accommodates teams and spectators. Surrounded by Sylhet's scenic beauty, this field provides a unique and enjoyable atmosphere for tournaments.</p>
        
        <h3>Key Considerations for Tournament Organizers</h3>
        <p>When choosing a cricket ground for tournament play in Chittagong or Sylhet, keep these factors in mind:</p>
        <ul>
          <li><strong>Pitch Quality:</strong> Both Futsal Arena Sports Center and Tea Garden Sports Field offer well-maintained pitches suitable for competitive cricket.</li>
          <li><strong>Amenities:</strong> Tea Garden Sports Field has an edge with changing rooms, while both venues provide parking for convenience.</li>
          <li><strong>Accessibility:</strong> Located in Sylhet, these grounds are easily accessible for local and visiting teams.</li>
          <li><strong>Capacity:</strong> Ensure the venue can accommodate your expected number of players and spectators. Contact the grounds for details on seating and space.</li>
          <li><strong>Price:</strong> Pricing varies based on amenities and demand, so reach out to the venues for accurate rates.</li>
        </ul>
        
        <h3>Why Only Sylhet?</h3>
        <p>While Chittagong is home to several multi-sport and football-specific turfs, the available data highlights only Sylhet-based venues as dedicated cricket grounds. For organizers in Chittagong, multi-sport facilities like Chattoground or The Green Field could potentially be adapted for cricket tournaments, but confirmation with the venues is recommended.</p>
        
        <h3>Final Thoughts</h3>
        <p>Sylhet's Futsal Arena Sports Center and Tea Garden Sports Field stand out as the best cricket grounds for tournament play, offering quality pitches and essential amenities. These venues are well-equipped to host memorable and competitive tournaments, whether for local leagues or larger events. For organizers seeking a reliable and accessible cricket ground, these Sylhet-based fields are top choices.</p>
        
        <p>To book or inquire about tournament arrangements, contact the venues directly using the provided details. Have a favorite cricket ground in Chittagong or Sylhet we missed? Share your recommendations in the comments!</p>
      `
    },
    4: {
      id: 4,
      title: "Multi-Sport Complexes: The Future of Sports",
      excerpt: "Modern multi-sport facilities that combine football, basketball, tennis, and more under one roof, offering versatile spaces for athletes and sports enthusiasts.",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80",
      category: "Multi-Sport",
      author: "Sports Analyst",
      date: "Dec 8, 2024",
      readTime: 4,
      content: `
        <p>In the evolving world of sports, multi-sport complexes are emerging as game-changers, redefining how communities engage with athletic activities. These versatile facilities, designed to host a variety of sports under one roof, are gaining traction in cities like Chittagong and Sylhet. By offering state-of-the-art amenities and fostering inclusivity, multi-sport complexes are shaping the future of sports. In this blog, we explore why these venues are becoming the go-to choice for athletes, organizers, and communities, with a focus on top multi-sport complexes in Chittagong and Sylhet.</p>
        
        <h3>Why Multi-Sport Complexes?</h3>
        <p>Unlike traditional single-sport fields, multi-sport complexes cater to a diverse range of activities, from futsal and cricket to badminton and more. This versatility makes them ideal for urban areas where space is limited, and demand for recreational facilities is high. These complexes offer modern amenities, accessibility, and the ability to host multiple events simultaneously, making them a hub for sports enthusiasts of all ages and skill levels. In Chittagong and Sylhet, several standout multi-sport complexes are leading the charge.</p>
        
        <h3>Benefits of Multi-Sport Complexes</h3>
        <ul>
          <li><strong>Versatility:</strong> Multi-sport complexes accommodate various sports, allowing players to explore different activities without needing multiple venues.</li>
          <li><strong>Community Engagement:</strong> By hosting tournaments, leagues, and casual games, these complexes bring people together, fostering a sense of community.</li>
          <li><strong>Modern Amenities:</strong> Facilities like air-conditioned changing rooms, cafeterias, and floodlights enhance the experience for players and spectators.</li>
          <li><strong>Space Efficiency:</strong> In crowded cities, multi-sport complexes maximize limited space by supporting multiple sports on adaptable surfaces.</li>
          <li><strong>Year-Round Accessibility:</strong> With features like lighting and climate-controlled areas, these venues enable play in any weather or time of day.</li>
        </ul>
        
        <h3>Top Multi-Sport Complexes in Chittagong and Sylhet</h3>
        
        <h4>1. Chattoground</h4>
        <p><strong>Rating:</strong> 4.9/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> Parking, Cafeteria, AC, Changing Room<br>
        <strong>Contact:</strong> +880 1756-789012 | reservations@Chattoground.com</p>
        <p>Chattoground is a premier multi-sport complex in Chittagong, boasting an outstanding 4.9 rating. Equipped with a high-quality turf suitable for futsal, football, and other sports, it offers a top-tier experience. The air-conditioned changing rooms and on-site cafeteria provide comfort and convenience, while ample parking and lighting make it ideal for evening tournaments and casual games. Chattoground's versatility and premium facilities make it a standout choice for sports enthusiasts.</p>
        
        <h4>2. The Green Field</h4>
        <p><strong>Rating:</strong> 4.7/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> Parking, Cafeteria, AC, Changing Room, Lighting<br>
        <strong>Contact:</strong> +880 1778-901234 | elite@TheGreenField.com</p>
        <p>The Green Field, with a 4.7 rating, is another gem in Chittagong's sports scene. This multi-sport complex supports a range of activities, including futsal and potentially cricket, with its adaptable playing surface. Its extensive amenities, including floodlights, air-conditioned facilities, and a cafeteria, ensure a comfortable experience for players and spectators. The Green Field is perfect for hosting large-scale events or community gatherings, making it a cornerstone of Chittagong's sports culture.</p>
        
        <h4>3. Turf Bakalia</h4>
        <p><strong>Rating:</strong> 4.6/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> AC, Changing Room, Lighting, Parking<br>
        <strong>Contact:</strong> +880 1801-234567 | TurfBakalia@gmail.com</p>
        <p>Turf Bakalia, rated 4.6, is a versatile multi-sport facility in Chittagong, well-suited for futsal and other sports. Its well-lit turf and air-conditioned changing rooms provide an excellent environment for both competitive and recreational play. With ample parking, it's easily accessible for teams and visitors. Turf Bakalia's vibrant atmosphere and modern facilities make it a popular choice for local leagues and social sports events.</p>
        
        <h4>4. Sports Heaven Sylhet</h4>
        <p><strong>Rating:</strong> 4.6/5<br>
        <strong>Location:</strong> Sylhet<br>
        <strong>Amenities:</strong> Parking, Lighting<br>
        <strong>Contact:</strong> +880 1845-678901 | booking@SportsHeaven.com</p>
        <p>In Sylhet, Sports Heaven Sylhet stands out with a 4.6 rating. This multi-sport complex is ideal for futsal and other activities, offering a high-quality pitch and essential amenities like parking and lighting. While it has fewer amenities than some Chittagong counterparts, its accessibility and well-maintained facilities make it a go-to venue for Sylhet's sports community. It's perfect for hosting local tournaments or casual matches.</p>
        
        <h4>5. Chatto Turf</h4>
        <p><strong>Rating:</strong> 4.2/5<br>
        <strong>Location:</strong> Chittagong<br>
        <strong>Amenities:</strong> Lighting, Changing Room<br>
        <strong>Contact:</strong> +880 1734-567890 | info@ChattoTurf.com</p>
        <p>Chatto Turf, with a 4.2 rating, rounds out the list as a reliable multi-sport complex in Chittagong. Its adaptable turf supports futsal and other sports, and the inclusion of lighting and changing rooms ensures a comfortable experience. While it offers fewer amenities than higher-rated venues, its affordability and central location make it a great option for community events and casual play.</p>
        
        <h3>The Future of Sports: Why Multi-Sport Complexes Matter</h3>
        <p>Multi-sport complexes are paving the way for a more inclusive and dynamic sports culture. By catering to diverse interests, they encourage participation from all age groups and skill levels, fostering a healthier and more connected community. These venues also support local economies by attracting tournaments, visitors, and sponsorships. As urban areas like Chittagong and Sylhet continue to grow, the demand for such facilities will only increase, making them a cornerstone of the future of sports.</p>
        
        <h3>Choosing the Right Multi-Sport Complex</h3>
        <p>When selecting a multi-sport complex, consider the following:</p>
        <ul>
          <li><strong>Amenities:</strong> Look for facilities like AC, cafeterias, and changing rooms for added comfort, especially for tournaments.</li>
          <li><strong>Versatility:</strong> Ensure the venue supports your preferred sports, such as futsal or cricket.</li>
          <li><strong>Rating:</strong> Higher ratings, like Chattoground's 4.9, often indicate better maintenance and user satisfaction.</li>
          <li><strong>Accessibility:</strong> All listed complexes are centrally located in Chittagong or Sylhet, making them easy to reach.</li>
          <li><strong>Price:</strong> Contact the venues for pricing details, as costs vary based on amenities and demand.</li>
        </ul>
        
        <h3>Final Thoughts</h3>
        <p>Multi-sport complexes like Chattoground, The Green Field, Turf Bakalia, Sports Heaven Sylhet, and Chatto Turf are transforming the sports landscape in Chittagong and Sylhet. With their versatility, modern amenities, and community-focused environments, these venues are setting the stage for the future of sports. Whether you're an athlete, organizer, or spectator, these complexes offer the perfect setting for unforgettable sporting experiences.</p>
        
        <p>Ready to play? Contact these venues to book your next game or tournament. Have a favorite multi-sport complex in Chittagong or Sylhet? Share your thoughts in the comments!</p>
      `
    }
  };

  const blog = blogData[id];

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <div className="blog-not-found">
            <h2>Blog Post Not Found</h2>
            <p>The blog post you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/')} className="back-btn">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <button onClick={() => navigate('/')} className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <article className="blog-article">
          <div className="blog-header">
            <div className="blog-category-badge">
              <span className="category-tag">{blog.category}</span>
            </div>
            <h1 className="blog-title">{blog.title}</h1>
            <div className="blog-meta">
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>By {blog.author}</span>
              </div>
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{blog.date}</span>
              </div>
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx={12} cy={12} r={10} />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span>{blog.readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="blog-image">
            <img src={blog.image} alt={blog.title} />
          </div>

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </div>
    </div>
  );
}

export default BlogDetail;