export default function ServicesIntro() {
  return (
    <section className="home-container section-space services-grid">
      <div className="services-image services-video">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="A video tour inside Shanzo Salon"
        >
          <source
            src="/media/5B373F1C-7DB4-49FC-BC2B-4EA1F753CC13.mp4"
            type="video/mp4"
          />
          Your browser does not support video playback.
        </video>
      </div>
      <div className="services-copy">
        <h2 className="section-title font-script">Expert NAIL SERVICES</h2>
        <p>
          At Shanzo Salon, we specialize in the latest nail trends and
          techniques. Our skilled nail artists are dedicated to providing a
          personalized experience that enhances the beauty of your hands and
          nails.
        </p>
      </div>
    </section>
  );
}
