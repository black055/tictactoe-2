function Square({highlight, onClick, value}) {
  return (
    <button
        className={`square ${highlight ? 'highlight' : ''}`}
        onClick={onClick}
    >
      {value}
    </button>
  );
}

export default Square;