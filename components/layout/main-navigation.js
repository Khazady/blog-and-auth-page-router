import Link from "next/link";

export default function MainNavigation() {
    return (
        <header>
            <Link bref='/'><Logo/></Link>
            <nav>
                <ul>
                    <li>
                        <Link href="/posts">Posts</Link>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
