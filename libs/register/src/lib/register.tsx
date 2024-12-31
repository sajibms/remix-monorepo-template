import AnimatedButton from './AnimatedButton';
import styles from './register.module.css';

export function Register() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Register!</h1>
      <AnimatedButton text="Register" />
    </div>
  );
}

export default Register;
