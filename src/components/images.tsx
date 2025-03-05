/**
 * React Compound Pattern using React.createContext, Context.Provider and useContext with
 * extra features:
 * - add click event to menu
 * - click outside to close
 * https://www.patterns.dev/react/compound-pattern
 */
import React from 'react';

const sources = [
  'https://images.pexels.com/photos/939478/pexels-photo-939478.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/1692984/pexels-photo-1692984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/162829/squirrel-sciurus-vulgaris-major-mammal-mindfulness-162829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
];

const FlyoutContext = React.createContext<{
  open: boolean;
  toggle: (force?: boolean) => void;
  onClick: (action: string) => void;
} | null>(null);

const FlyoutMenu = ({
  style,
  onClick,
}: {
  style: React.CSSProperties;
  onClick: (action: string) => void;
}) => {
  return (
    <div style={style}>
      <Flyout onClick={onClick}>
        <Flyout.Toggle />
        <Flyout.List>
          <Flyout.Item>Edit</Flyout.Item>
          <Flyout.Item>Delete</Flyout.Item>
        </Flyout.List>
      </Flyout>
    </div>
  );
};

const Flyout = ({
  children,
  onClick,
}: {
  children: React.ReactElement[];
  onClick: (action: string) => void;
}) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <FlyoutContext.Provider
      value={{
        open: visible,
        toggle: (force) => {
          if (typeof force === 'boolean') {
            setVisible(force);
            return;
          }

          setVisible((visible) => {
            // console.log('toggle from', visible, 'to', !visible);
            return !visible;
          });
        },
        onClick,
      }}
    >
      {children}
    </FlyoutContext.Provider>
  );
};
const FlyoutToggle = () => {
  const { toggle } = React.useContext(FlyoutContext)!;
  const ref = React.useRef<HTMLSpanElement>(null);

  // click outside of toggle to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // console.log('ref.current:', ref.current);
      // console.log('event.target:', event.target);
      // console.log(
      //   'ref.current.contains(event.target):',
      //   ref.current?.contains(event.target)
      // );
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setTimeout(() => {
          toggle(false);
        }, 100);
      }
    };
    console.log('adding event listener');
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <span
      ref={ref}
      onClick={() => toggle()}
      style={{
        background: 'black',
        color: 'white',
        borderRadius: '50%',
        width: '4rem',
        display: 'inline-block',
        height: '4rem',
        fontSize: '2rem',
        cursor: 'pointer',
      }}
    >
      ...
    </span>
  );
};

const FlyoutList = ({ children }: { children: React.ReactNode }) => {
  const { open } = React.useContext(FlyoutContext)!;

  return (
    open && (
      <ul
        style={{
          position: 'absolute',
          right: '0',
          background: 'black',
          color: 'white',
          listStyle: 'none',
          textAlign: 'left',
          padding: '1rem',
          marginTop: '0.2rem',

          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {children}
      </ul>
    )
  );
};

const FlyoutItem = ({ children }: { children: React.ReactNode }) => {
  const { onClick } = React.useContext(FlyoutContext)!;
  return (
    <li
      // @ts-expect-error xxx
      onClick={(event) => onClick(event.target.textContent)}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </li>
  );
};

Flyout.Item = FlyoutItem;
Flyout.Toggle = FlyoutToggle;
Flyout.List = FlyoutList;

export const Images = () => {
  return sources.map((src, index) => (
    <div key={index} style={{ position: 'relative', width: '60%' }}>
      <img src={src} width={'100%'} height={'100%'} alt='' />
      <FlyoutMenu
        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
        onClick={(action: string) => console.log(action + ' clicked')}
      />
    </div>
  ));
};
