import clsx from "clsx";
import styles from "./Cancha.module.css";


export default function Cancha({ formacion, equipo, habilitados = [], onElegir }) {
  return (
    <div className={styles.cancha}>
      {formacion.map((puesto) => {
        const jugador = equipo.find((elegido) => elegido.numero === puesto.numero);
        const habilitado = habilitados.includes(puesto.numero);

        return (
          <button
            key={puesto.numero}
            type="button"
            disabled={!habilitado}
            onClick={() => onElegir(puesto.numero)}
            className={clsx(styles.puesto, {
              [styles.lleno]: jugador,
              [styles.habilitado]: habilitado,
            })}
            style={{ left: `${puesto.x}%`, top: `${puesto.y}%` }}
          >
            {jugador ? (
              <span className={styles.contenido}>
                <span className={styles.nombre}>{jugador.nombre}</span>
                <span className={styles.valor}>{jugador.valoracion}</span>
              </span>
            ) : (
              puesto.etiqueta
            )}
          </button>
        );
      })}
    </div>
  );
}