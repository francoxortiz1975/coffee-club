import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { lessons, chapters, KIND_STYLE } from '../data/journey'
import { getRead, markRead } from '../lib/journeyProgress'
import { ArrowLeftIcon } from '../components/Icons'

// One lesson. Opening it marks it as read.
export default function JourneyLesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const i = lessons.findIndex((l) => l.id === id)
  const lesson = lessons[i]

  useEffect(() => { if (lesson) markRead(lesson.id) }, [lesson])

  if (!lesson) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-cafe-dark font-display font-bold">Lesson not found</p>
        <Link to="/journey" className="inline-block mt-4 text-sm font-semibold text-cafe-accent underline">Back to the journey</Link>
      </div>
    )
  }
  const k = KIND_STYLE[lesson.kind]
  const read = getRead()
  const next = lessons.slice(i + 1).find((l) => !read.has(l.id) && l.id !== lesson.id) || lessons.slice(0, i).find((l) => !read.has(l.id))
  const chapter = chapters.find((c) => c.id === lesson.chapter)

  return (
    <div className="pb-6">
      <div className="px-4 pb-6 text-beige" style={{ background: `linear-gradient(150deg, ${k.from}, ${k.to})`, paddingTop: 'calc(10px + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} aria-label="Back" className="-ml-2 w-11 h-11 flex items-center justify-center active:scale-95 transition-transform">
          <ArrowLeftIcon size={20} />
        </button>
        <p className="text-[11px] font-sans font-semibold tracking-widest opacity-85 mt-2">{chapter?.title.toUpperCase()} · {lesson.kind.toUpperCase()} · {lesson.minutes} MIN</p>
        <h1 className="text-3xl font-display font-bold leading-tight mt-2">{lesson.title}</h1>
        <p className="text-4xl mt-4" aria-hidden="true">{k.emoji}</p>
      </div>

      <article className="px-5 pt-5 flex flex-col gap-4">
        {lesson.body.map((p, n) => <p key={n} className="text-base text-cafe-dark leading-relaxed">{p}</p>)}
      </article>

      <div className="px-5 mt-8">
        {next ? (
          <Link to={`/journey/${next.id}`} className="w-full min-h-12 rounded-full bg-cafe-dark text-[#b8d04a] text-sm font-bold flex items-center justify-center active:scale-[0.98] transition-transform">
            Next lesson: {next.title} ›
          </Link>
        ) : (
          <Link to="/journey" className="w-full min-h-12 rounded-full bg-[#b8d04a] text-[#1f1409] text-sm font-bold flex items-center justify-center active:scale-[0.98] transition-transform">
            You have read them all. Back to the journey
          </Link>
        )}
      </div>
    </div>
  )
}
