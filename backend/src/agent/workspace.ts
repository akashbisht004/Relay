import path from "node:path";

export function resolveWorkspacePath(
    workspacePath: string,
    filePath: string
): string {

    const absolutePath = path.resolve(workspacePath, filePath);

    const relativePath = path.relative(
        workspacePath,
        absolutePath
    );

    if (
        relativePath.startsWith("..") ||
        path.isAbsolute(relativePath)
    ) {
        throw new Error(
            `Path "${filePath}" is outside the workspace`
        );
    }

    return absolutePath;
}