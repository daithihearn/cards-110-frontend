export const FormatName = (name: string) =>
    name
        .split("@")[0]
        .split(RegExp("[ .,]+"))
        .map(word =>
            word.length < 3
                ? word
                : word.charAt(0).toUpperCase() +
                  word.slice(1).toLocaleLowerCase(),
        )
        .join(" ")
