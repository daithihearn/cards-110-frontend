export const FormatName = (name: string) =>
    name
        .split(" ")
        .map(word =>
            word.length < 3
                ? word
                : word.charAt(0).toUpperCase() +
                  word.slice(1).toLocaleLowerCase(),
        )
        .join(" ")
