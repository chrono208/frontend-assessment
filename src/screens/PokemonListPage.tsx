import React, { useMemo, useState } from 'react';
import { tss } from '../tss';
import { Modal } from 'antd';
import { useGetPokemons, useGetPokemonDetails } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { data } = useGetPokemons();

  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data: detail,
    loading: detailLoading,
    error: detailError,
  } = useGetPokemonDetails(selectedId ? parseInt(selectedId, 10) : undefined);

  const normalize = (s?: string) => (s ?? '').toLocaleLowerCase().trim();

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return data ?? [];
    return (data ?? []).filter((p) => normalize(p.name).includes(q));
  }, [data, query]);

  const openModal = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  return (
    <div className={classes.root}>
      <div className={classes.searchDiv}>
        <input
          type="search"
          placeholder="Search for a Pokemon"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul className={classes.grids}>
        {filtered.map((d) => (
          <li key={d.id} className={classes.cardBackground}>
            <button
              className={classes.buttons}
              onClick={() => openModal(d.id)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openModal(d.id)}
              aria-label={`Open details for ${d.name}`}
            >
              {d.sprite && (
                <img className={classes.image} src={d.sprite} alt={d.name} height={80} />
              )}
              <div className={classes.leftAlign}>
                <span>#{d.id}</span>
              </div>
              <div className={`${classes.leftAlign} ${classes.nameCard}`}>
                <span>{d.name}</span>
              </div>
              {!!d.types?.length && <div>{d.types.join(' / ')}</div>}
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        title={detail?.name ?? (detailError ? 'Error' : 'Loading…')}
      >
        {detailLoading && <p>Loading…</p>}
        {detailError && <p>Something went wrong. Please try again.</p>}
        {!detailLoading && !detailError && detail && (
          <div>
            {detail.sprite && (
              <img
                src={detail.sprite}
                alt={detail.name}
                height={100}
                style={{ display: 'block', margin: '0 auto 16px' }}
              />
            )}
            {!!detail.types?.length && (
              <p>
                <b>Types:</b> {detail.types.join(' / ')}
              </p>
            )}
            <p>
              <b>Height:</b> {detail.height} &nbsp;•&nbsp; <b>Weight:</b> {detail.weight}
            </p>
            {detail.captureRate !== undefined && (
              <p>
                <b>Capture Rate:</b> {detail.captureRate}
              </p>
            )}
            {detail.description && (
              <p style={{ marginTop: 12, lineHeight: '22px' }}>{detail.description}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    width: '50%',
  },
  searchDiv: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },
  leftAlign: {
    textAlign: 'left',
  },
  nameCard: {
    style: 'bold',
    fontSize: 20,
  },
  buttons: {
    border: '1px solid #fff',
    background: 'grey',
    cursor: 'pointer',
    padding: '12px 14px',
    borderRadius: 12,
    width: '11vh',
  },
  cardBackground: {
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: 'none',
  },
  grids: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 50,
    justifyItems: 'center',
    listStyle: 'none',
  },
  image: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.5) scaleX(-1)',
    },
    alignContent: 'center',
  },
}));
