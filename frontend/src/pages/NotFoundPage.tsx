import Button from "../components/Button/Button.tsx";
import {MdKeyboardArrowLeft} from "react-icons/md";

const NotFoundPage = () => {
    return (
        <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
            <section className="w-full max-w-2xl bg-main p-10 text-center">
                <p className="mb-3 text-sm font-semibold text-primary">
                    Error 404
                </p>

                <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">
                    Page not found
                </h1>

                <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                    The page you’re looking for doesn’t exist.
                </p>

                <div className="flex items-center justify-center">
                    <Button
                        link="/"
                        icon={MdKeyboardArrowLeft}
                    >
                        Back to home
                    </Button>
                </div>
            </section>
        </main>
    );
};

export default NotFoundPage;