import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import '../styles/SearchableSelect.css'

function SearchableSelect({ options, value, onChange, name, placeholder }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // กรองตัวเลือกตาม search
  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  )

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } })
    setIsOpen(false)
    setSearch('')
  }

  const handleOpen = () => {
    setIsOpen(true)
    setSearch('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div className="searchable-select" ref={wrapperRef}>
      {/* ปุ่มเปิด */}
      <button
        type="button"
        className="searchable-select__trigger form-input"
        onClick={handleOpen}
      >
        <span className={value ? '' : 'searchable-select__placeholder'}>
          {value || placeholder || 'เลือก...'}
        </span>
        <ChevronDown size={16} className={`searchable-select__arrow ${isOpen ? 'searchable-select__arrow--open' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="searchable-select__dropdown">
          <input
            ref={inputRef}
            type="text"
            className="searchable-select__search"
            placeholder="พิมพ์เพื่อค้นหา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="searchable-select__list">
            {filtered.length > 0 ? (
              filtered.map((opt, i) => (
                <li
                  key={i}
                  className={`searchable-select__item ${opt === value ? 'searchable-select__item--selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </li>
              ))
            ) : (
              <li className="searchable-select__empty">ไม่พบจังหวัดที่ค้นหา</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect
