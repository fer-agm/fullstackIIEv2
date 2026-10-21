import { Link, useParams } from 'react-router-dom';
import { getBlogById } from '../data/blogs.js';
import BlogVideo from '../components/BlogVideo.jsx';

export default function BlogDetalle() {
  const { id } = useParams();
  const post = getBlogById(id);

  if (!post) {
    return (
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="card text-center">
          <p>Artículo no encontrado.</p>
          <Link to="/blogs" className="btn-blue mt-2">Volver a Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h2 style={{ color: post.color }}>{post.title}</h2>
        {post.content.map((paragraph, i) => (
          <p key={i} style={{ color: 'var(--text-sub)', marginTop: '0.8rem' }}>{paragraph}</p>
        ))}

        <BlogVideo src={post.video} caption={post.videoCaption} />

        <div className="d-flex flex-wrap gap-2 mt-2">
          <a href={post.link} className="btn-blue" target="_blank" rel="noreferrer">{post.linkText}</a>
          <Link to="/blogs" className="btn-green">Volver a Blogs</Link>
        </div>
      </div>
    </div>
  );
}
