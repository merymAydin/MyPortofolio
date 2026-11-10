/**
 * Decorative survey-map fragment pinned behind the evidence board.
 * It carries no project information and is hidden from assistive technology.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional positioning class names.
 */
export default function BoardMap({ className = '' }) {
  return (
    <div className={`board-map ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 440 560" focusable="false">
        <g className="board-map__contours">
          <path d="M -12 418 C 68 354, 158 374, 218 426 S 356 502, 452 438" />
          <path d="M -12 442 C 68 386, 148 406, 218 452 S 356 522, 452 464" />
          <path d="M -12 392 C 78 328, 158 348, 228 398 S 368 472, 452 406" />
          <path d="M -12 92 C 78 28, 168 54, 228 104 S 366 176, 452 112" />
          <path d="M -12 68 C 78 8, 168 32, 228 82 S 366 154, 452 88" />
        </g>

        <g className="board-map__streets">
          <path d="M 22 58 L 414 128" />
          <path d="M 8 118 L 426 186" />
          <path d="M 12 196 L 420 258" />
          <path d="M 18 274 L 428 334" />
          <path d="M 8 350 L 420 412" />
          <path d="M 36 472 L 426 524" />
          <path d="M 62 12 L 106 548" />
          <path d="M 118 6 L 158 552" />
          <path d="M 178 10 L 212 548" />
          <path d="M 238 14 L 270 544" />
          <path d="M 300 8 L 326 536" />
          <path d="M 356 14 L 382 540" />
          <path d="M 26 32 L 390 502" />
          <path d="M 384 30 L 48 520" />
        </g>

        <g className="board-map__blocks">
          <path d="M 72 138 L 156 154 L 150 188 L 66 172 Z" />
          <path d="M 188 146 L 274 160 L 268 192 L 182 178 Z" />
          <path d="M 330 156 L 402 168 L 396 202 L 324 190 Z" />
          <path d="M 92 238 L 172 252 L 166 284 L 86 270 Z" />
          <path d="M 206 246 L 286 258 L 280 292 L 200 280 Z" />
          <path d="M 330 258 L 404 270 L 398 302 L 324 290 Z" />
          <path d="M 74 362 L 154 376 L 148 406 L 68 392 Z" />
          <path d="M 190 370 L 268 382 L 262 414 L 184 402 Z" />
        </g>

        <path
          className="board-map__river"
          d="M -18 206 C 46 194, 94 226, 150 224 S 246 186, 302 196 S 390 236, 458 220"
        />
        <path
          className="board-map__river"
          d="M -18 232 C 46 220, 94 252, 150 250 S 246 212, 302 222 S 390 262, 458 246"
        />
        <path
          className="board-map__bridge"
          d="M 152 220 L 158 248 M 300 192 L 306 220"
        />

        <g className="board-map__compass">
          <circle cx="352" cy="474" r="29" />
          <circle cx="352" cy="474" r="21" />
          <path d="M 352 442 L 360 474 L 352 506 L 344 474 Z" />
          <path d="M 320 474 L 352 466 L 384 474 L 352 482 Z" />
        </g>

        <path className="board-map__scale" d="M 42 512 H 122 M 42 506 V 518 M 82 506 V 518 M 122 506 V 518" />
      </svg>
    </div>
  )
}
