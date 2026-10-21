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
        <h2 className="section-title font-script">A little time, beautifully yours.</h2>
        <p>Hair, nails, and waxing for men, women, and kids, with care shaped around you.</p>
        <p>A warm welcome awaits at Shanzo Salon, 67 W Chicago Ave, Chicago.</p>
      </div>
    </section>
  );
}
