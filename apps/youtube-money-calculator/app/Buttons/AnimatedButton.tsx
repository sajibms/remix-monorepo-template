export default function AnimatedButton({ text }: Readonly<{ text: string }>) {
  return (
    <button
      className="text-white font-extrabold text-[16px] py-4 px-14 cursor-pointer rounded-lg border-b-2 transition-all duration-300 shadow-lg"
      style={{
        background:
          'linear-gradient(0deg, rgba(252, 153, 63, 1) 0%, rgba(252, 187, 70, 1) 100%)',
        transform: 'perspective(200px) rotateX(5deg)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform =
          'perspective(180px) rotateX(5deg) translateY(2px)';
      }}
      onFocus={(e) => {
        e.currentTarget.style.transform =
          'perspective(180px) rotateX(5deg) translateY(2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'perspective(200px) rotateX(5deg)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = 'perspective(200px) rotateX(5deg)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform =
          'perspective(170px) rotateX(5deg) translateY(5px)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform =
          'perspective(180px) rotateX(5deg) translateY(2px)';
      }}
    >
      {text}
    </button>
  );
}
