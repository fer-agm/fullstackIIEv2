import { Link } from 'react-router-dom';
import { BLOGS } from '../data/blogs.js';

export default function Blogs() {
  return (
    <div className="container">
      <h2>Blogs & Noticias Gamer</h2>

      {BLOGS.map((post, i) => (
        <div className="card" key={post.id}>
          <h3 style={{ color: post.color }}>Link {i + 1}: {post.title}</h3>
          <p style={{ color: 'var(--text-sub)', margin: '0.5rem 0' }}>{post.summary}</p>
          <div className="d-flex flex-wrap gap-2">
            <Link to={`/blogs/${post.id}`} className="btn-green">Leer artículo y ver video</Link>
            <a href={post.link} className="btn-blue" target="_blank" rel="noreferrer">{post.linkText}</a>
          </div>
        </div>
      ))}
    </div>
  );
}
